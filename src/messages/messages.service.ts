import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MessagesService {
	constructor(private prismaService: PrismaService) {}

	async create(text: string, authorId: number, channelId: number) {
		return this.prismaService.message.create({
			data: {
				text,
				authorId,
				channelId,
			},
		})
	}

	async findMessages(channelId?: number) {
		return this.prismaService.message.findMany({ where: { channelId } })
	}
}
