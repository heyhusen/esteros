import type { AddCartItem, Cart, PubSubPattern } from '@esteros/types';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Post,
	Res,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import { Cookies } from '../app.decorator';
import { AddCartItemDto } from './carts.dto';

@Controller('carts')
export class CartsController {
	constructor(@Inject('CART_SERVICE') private readonly client: ClientProxy) {}

	@Get()
	getCart(@Cookies('user_id') userId?: string): Observable<Cart> {
		if (!userId) {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
		}

		const pattern: PubSubPattern = { cmd: 'getCart' };

		const cart = this.client.send<Cart, string>(pattern, userId);

		if (!cart) {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
		}

		return cart;
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	addItem(
		@Body() dto: AddCartItemDto,
		@Res({
			passthrough: true,
		})
		res: Response,
		@Cookies('user_id') userId?: string,
	): Observable<Cart> {
		const { product_id, quantity } = dto;
		let existingUserId = userId;

		if (!existingUserId) {
			existingUserId = randomUUID();

			res.cookie('user_id', existingUserId, {
				secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production',
				httpOnly: true,
				path: '/',
				maxAge: 172800000, // 2 days
			});
		}

		const pattern: PubSubPattern = { cmd: 'addItemIntoCart' };

		const cart = this.client.send<Cart, AddCartItem>(pattern, {
			user_id: existingUserId,
			product_id,
			quantity,
		});

		return cart;
	}

	@Post('empty')
	@HttpCode(HttpStatus.NO_CONTENT)
	emptyCart(@Cookies('user_id') userId: string): Observable<boolean> {
		const pattern: PubSubPattern = { cmd: 'emptyCart' };

		return this.client
			.send<boolean, string>(pattern, userId)
			.pipe(map((res) => res));
	}
}
