import { RedisOmModule } from '@bowbridge/nest-redis-om';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		RedisOmModule.forRoot({
			host: 'localhost',
			port: 6379,
		}),
		ClientsModule.register([
			{
				name: 'PRODUCT_SERVICE',
				transport: Transport.REDIS,
				options: {
					host: 'localhost',
					port: 6379,
				},
			},
		]),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
