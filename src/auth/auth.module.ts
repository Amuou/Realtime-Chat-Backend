import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { PrismaService } from 'src/prisma.service'
import { LocalStrategy } from './local.strategy'

@Module({
	imports: [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '96h' },
		}),
	],
	providers: [AuthService, JwtStrategy, PrismaService, LocalStrategy],
	exports: [AuthService],
})
export class AuthModule {}
