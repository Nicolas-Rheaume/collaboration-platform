import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer, Server } from 'http';
import mysql from 'mysql';
import path from 'path';
import SocketIO from 'socket.io';
import { environment } from 'environments/environment';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

import { join } from 'path';

async function bootstrap() {
	// Declaration
	//const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const port = parseInt(process.env.SERVER_PORT) || environment.server_port;
	const logger: Logger = new Logger('Main');

	// Configuration
	app.enableCors();

	// Static Files Registration.
	app.useStaticAssets(join(__dirname, 'assets'));

	// Start Server
	await app.listen(port, '0.0.0.0').then(() => {
		logger.log(`Server listening on port : ${port}`);
	});
}
bootstrap();
