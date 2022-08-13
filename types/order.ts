export interface Order {
	confirmation_number: string;
	tracking_number: string;
	price: number;
}

export interface Address {
	street: string;
	zip_code: number;
	city: string;
	state: string;
	country: string;
}

export interface CreditCard {
	number: string;
	expiration_month: number;
	expiration_year: number;
	ccv: number;
}

export interface CreateOrder {
	user_id: string;
	email: string;
	address: Address;
	credit_card: CreditCard;
}
