import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersService } from './users/users.service'
import { UsersModule } from './users/users.module'
import { PrismaService } from './prisma.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { ChatModule } from './chat/chat.module'
import { MessagesService } from './messages/messages.service'
import { MessagesModule } from './messages/messages.module'
import { AuthService } from './auth/auth.service'
import { ChatGateway } from './chat/chat.gateway'

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 100,
		}),
		AuthModule,
		UsersModule,
		MessagesModule,
		ChatModule,
	],
	controllers: [AppController],
	providers: [
		PrismaService,
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_GUARD,
			useClass: LocalAuthGuard,
		},
	],
})
export class AppModule {}
