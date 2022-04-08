import { Injectable } from '@nestjs/common'
import { Channel, User } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { UserWithoutPassword } from 'src/types'

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findOne(name: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				name,
			},
		})
	}

	async findUserChannels(userId: number): Promise<any> {
		const channels = await this.prisma.channel.findMany({
			where: {
				members: {
					some: {
						id: userId,
					},
				},
			},
			include: {
				members: true,
				messages: true,
			},
		})

		if (!channels) return []

		return channels.map((channel) => {
			const { members } = channel
			const member = members.find((member) => member.id !== userId)
			if (!member) return channel
			const { avatar, name } = member
			return { ...channel, image: avatar, name: name }
		})
	}

	async findUsersByName(name: string): Promise<UserWithoutPassword[]> {
		return this.prisma.user.findMany({
			where: {
				name: {
					startsWith: name,
				},
			},
			select: {
				id: true,
				name: true,
				avatar: true,
				channels: true,
			},
		})
	}

	async createPersonalChannel(userId: number, otherUserId: number): Promise<Channel | null> {
		if (!userId && !otherUserId) return null
		const commonChannels = await this.prisma.user
			.findUnique({
				where: {
					id: userId,
				},
			})
			.channels({
				where: {
					members: {
						some: {
							id: otherUserId,
						},
					},
				},
			})
		if (commonChannels.length > 0) return null
		const channel = await this.prisma.channel.create({
			data: {
				personal: true,
				members: {
					connect: [{ id: userId }, { id: otherUserId }],
				},
			},
		})

		return channel
	}
}
