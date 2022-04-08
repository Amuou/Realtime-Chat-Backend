import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { fastifyHelmet } from 'fastify-helmet'
import compression from 'fastify-compress'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true }),
	)
	await app.register(fastifyHelmet)
	await app.register(compression)
	app.enableCors()

	await app.listen(3010, '0.0.0.0')
}

bootstrap()
