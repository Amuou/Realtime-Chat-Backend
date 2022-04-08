import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { MessagesService } from 'src/messages/messages.service'

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayInit {
	@WebSocketServer()
	server?: Server
	private logger: Logger = new Logger('ChatGateway')

	constructor(private messagesService: MessagesService) {}

	@SubscribeMessage('send-message')
	async handleMessage(
		client: Socket,
		payload: { text: string; authorId: number; channelId: number },
	): Promise<void> {
		await this.messagesService.create(payload.text, payload.authorId, payload.channelId)
		const messages = await this.messagesService.findMessages(payload.channelId)
		console.warn(messages)
		this.server?.emit('save-message', messages)
	}

	afterInit() {
		this.logger.log('Init')
	}
}
