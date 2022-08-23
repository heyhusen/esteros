import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import type { AddCartItem } from '@esteros/types';

export class AddCartItemDto implements Omit<AddCartItem, 'user_id'> {
	@IsNotEmpty()
	@IsString()
	product_id: string;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	quantity: number;
}
