import { Controller, Get, Req, Post, UseGuards, Query, Body } from '@nestjs/common'
import { AuthService } from './auth/auth.service'
import { Request } from 'express'
import { Public } from './auth/auth.decorators'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { UsersService } from './users/users.service'

@Controller()
export class AppController {
	constructor(private authService: AuthService, private usersService: UsersService) {}

	@Public()
	@Post('auth/signup')
	async signup(@Req() req: Request) {
		return this.authService.signup(req.body.name, req.body.password, req.body.avatar)
	}

	@UseGuards(LocalAuthGuard)
	@Post('auth/signin')
	async login(@Req() req: Request) {
		return this.authService.signin(req.user)
	}

	@Public()
	@Get('user')
	async getUser(@Req() req: Request) {
		const user = await this.authService.findUserByToken(
			req.headers?.authorization?.replace('Bearer ', '') || '',
		)
		return user
	}

	@Public()
	@Get('channels')
	async getChannels(@Query('userId') userId: string) {
		return await this.usersService.findUserChannels(+userId)
	}

	@Public()
	@Get('users')
	async getUsersByName(@Query('name') name: string) {
		return await this.usersService.findUsersByName(name)
	}

	@Public()
	@Post('channels/create-personal')
	async createPersonalChannel(@Body() body: { userId: number; otherUserId: number }) {
		return await this.usersService.createPersonalChannel(body.userId, body.otherUserId)
	}
}
