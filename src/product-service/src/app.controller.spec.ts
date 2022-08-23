import { RedisOmModule } from '@bowbridge/nest-redis-om';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Module } from 'nestjs-aws-s3';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
			imports: [RedisOmModule.forRoot({}), S3Module.forRoot({})],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	it('should be defined', () => {
		expect(appController).toBeDefined();
	});
});
