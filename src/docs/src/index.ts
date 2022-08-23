import express from 'express';
import { readFileSync } from 'fs';
import type { JsonObject } from 'swagger-ui-express';
import { serve, setup } from 'swagger-ui-express';
import { parse } from 'yaml';

const app = express();

const openapiSpec = readFileSync('../../openapi.yaml', 'utf8');
const swaggersDoc = parse(openapiSpec) as JsonObject;

app.use('/', serve);
app.get('/', setup(swaggersDoc));

app.listen(3001, () => {
	console.log(`Server up and running at http://localhost:3001`);
});
