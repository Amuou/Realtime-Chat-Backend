import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { PrismaService } from 'src/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private prisma: PrismaService,
	) {}

	async signup(name: string, password: string, avatar?: string) {
		const saltOrRounds = 10
		const hash = await bcrypt.hash(password, saltOrRounds)
		const user = await this.prisma.user.create({
			data: {
				name,
				password: hash,
				avatar: avatar ?? '',
			},
		})
		const token = await this.signin({ name: user.name, id: user.id })

		return token
	}

	async validateUser(name: string, pass: string): Promise<any> {
		const user = await this.usersService.findOne(name)
		if (!user) return null
		const isCorrectPassword = await bcrypt.compare(pass, user.password)
		if (isCorrectPassword) {
			const { password, ...result } = user
			return result
		}
		return null
	}

	async signin(user: any) {
		const payload = { name: user.name, sub: user.id }
		return {
			access_token: this.jwtService.sign(payload),
			user,
		}
	}

	async findUserByToken(token: string) {
		try {
			const { name } = this.jwtService.verify(token)
			const user = this.usersService.findOne(name)
			return user
		} catch {
			return null
		}
	}
}
