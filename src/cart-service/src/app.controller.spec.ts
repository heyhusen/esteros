import { RedisOmModule } from '@bowbridge/nest-redis-om';
import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
			imports: [
				RedisOmModule.forRoot({
					host: 'localhost',
					port: 6379,
				}),
				ClientsModule.register([
					{
						name: 'PRODUCT_SERVICE',
					},
				]),
			],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	it('should be defined', () => {
		expect(appController).toBeDefined();
	});
});
