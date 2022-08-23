import { RedisOmModule } from '@bowbridge/nest-redis-om';
import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-aws-s3';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		RedisOmModule.forRoot({
			host: 'localhost',
			port: 6379,
			username: '',
			password: '',
		}),
		S3Module.forRoot({
			endpoint: {
				protocol: 'http',
				hostname: 'localhost',
				port: 9000,
				path: '/',
			},
			region: 'ap-southeast-1',
			credentials: {
				accessKeyId: 'miniosudo',
				secretAccessKey: 'miniosudo',
			},
			forcePathStyle: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
