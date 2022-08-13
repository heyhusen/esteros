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
import type { Observable } from 'rxjs';
import type { Cart, AddCartItem } from '@esteros/types';
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

		const result = this.client.send<Cart, string>(
			{
				cmd: 'getCart',
			},
			userId,
		);

		if (!result) {
			throw new HttpException('No Content', HttpStatus.NO_CONTENT);
		}

		return result;
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
				maxAge: 604800, // 7 days
			});
		}

		const result = this.client.send<Cart, AddCartItem>(
			{
				cmd: 'addItemIntoCart',
			},
			{
				user_id: existingUserId,
				product_id,
				quantity,
			},
		);

		return result;
	}

	@Post('empty')
	@HttpCode(HttpStatus.NO_CONTENT)
	emptyCart(@Cookies('user_id') userId?: string) {
		if (userId) {
			this.client.send({ cmd: 'emptyCart' }, userId);
		}
	}
}
