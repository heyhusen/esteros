import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	IsString,
	ValidateNested,
} from 'class-validator';
import type {
	Address as IAddress,
	CreateOrder,
	CreditCard as ICreditCard,
} from '@esteros/types';
import { Type } from 'class-transformer';

export class Address implements IAddress {
	@IsNotEmpty()
	@IsString()
	street: string;

	@IsNotEmpty()
	@IsInt()
	zip_code: number;

	@IsNotEmpty()
	@IsString()
	city: string;

	@IsNotEmpty()
	@IsString()
	state: string;

	@IsNotEmpty()
	@IsString()
	country: string;
}

export class CreditCard implements ICreditCard {
	@IsNotEmpty()
	@IsString()
	number: string;

	@IsNotEmpty()
	@IsInt()
	expiration_month: number;

	@IsNotEmpty()
	@IsInt()
	expiration_year: number;

	@IsNotEmpty()
	@IsInt()
	ccv: number;
}

export class CreateOrderDto implements Omit<CreateOrder, 'user_id'> {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsObject()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => Address)
	address: Address;

	@IsNotEmpty()
	@IsObject()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => CreditCard)
	credit_card: CreditCard;
}
