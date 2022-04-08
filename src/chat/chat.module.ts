import { Module } from '@nestjs/common'
import { MessagesModule } from 'src/messages/messages.module'
import { ChatGateway } from './chat.gateway'

@Module({
	providers: [ChatGateway],
	exports: [ChatGateway],
	imports: [MessagesModule],
})
export class ChatModule {}
