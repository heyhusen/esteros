import type { Product as IProduct } from "@esteros/types";
import { Client, Entity, Schema } from "redis-om";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

async function uploadToS3(path: string): Promise<string> {
	const s3 = new S3Client({
		endpoint: {
			protocol: "http",
			hostname: "localhost",
			port: 9000,
			path: "/",
		},
		region: "ap-southeast-1",
		credentials: {
			accessKeyId: "miniosudo",
			secretAccessKey: "miniosudo",
		},
		forcePathStyle: true,
	});

	const content = readFileSync(`./data/photos/${path}`);

	await s3.send(
		new PutObjectCommand({
			Bucket: "local",
			ACL: "public-read",
			Key: path,
			Body: content,
		})
	);

	return path;
}

async function init() {
	console.log('Uploading all data.');

	const data: Omit<IProduct, "id" | "created_at" | "updated_at">[] = [
		{
			name: "Ice Cream 1",
			sku: "ICRM0001",
			price: 1.35,
			photo: "najlacam-cfwrfZ4vhug-unsplash.jpg",
		},
		{
			name: "Ice Cream 2",
			sku: "ICRM0002",
			price: 1.5,
			photo: "najlacam-f5WcXes7b_0-unsplash.jpg",
		},
		{
			name: "Ice Cream 3",
			sku: "ICRM0003",
			price: 1.75,
			photo: "najlacam-qe6PziAk7Sg-unsplash.jpg",
		},
	];

	class Product extends Entity {}

	const productSchema = new Schema(Product, {
		name: {
			type: "string",
		},
		description: {
			type: "string",
		},
		sku: {
			type: "string",
		},
		price: {
			type: "number",
		},
		photo: {
			type: "string",
		},
		created_at: {
			type: "string",
		},
		updated_at: {
			type: "string",
		},
	});

	const redis = new Client();

	await redis.open("redis://localhost:6379");

	const productRepository = redis.fetchRepository(productSchema);

	await productRepository.createIndex();

	const today = new Date();

	for (const { photo, ...item } of data) {
		const uploadedPhotoUrl = await uploadToS3(photo);

		await productRepository.createAndSave({
			...item,
			photo: uploadedPhotoUrl,
			created_at: today.toISOString(),
			updated_at: today.toISOString(),
		});
	}

	await redis.close();

	console.log('All data uploaded successfully.')
}

init();
