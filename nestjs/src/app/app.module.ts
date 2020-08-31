/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

// Services
import { ConnectionService } from './models/connection/connection.service';

// Gateways
import { AppGateway } from './app.gateway';
import { AuthenticateGateway } from './controllers/authenticate/authenticate.gateway';
import { DashboardGateway } from './controllers/dashboard/dashboard.gateway';
import { EditorGateway } from './controllers/editor/editor.gateway';
import { ExplorerGateway } from './controllers/explorer/explorer.gateway';
import { CorpusGateway } from './controllers/corpus/corpus.gateway';
import { DocumentGateway } from './controllers/document/document.gateway';

// Controllers
import { AppController } from './app.controller';
import { AuthenticateController } from './controllers/authenticate/authenticate.controller';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { EditorController } from './controllers/editor/editor.controller';
import { ExplorerController } from './controllers/explorer/explorer.controller';
import { CorpusController } from './controllers/corpus/corpus.controller';
import { DocumentController } from './controllers/document/document.controller';

// Modules
import { UserModule } from './models/user/user.module';
import { ConceptModule } from './models/concept/concept.module';
import { CorpusModule } from './models/corpus/corpus.module';
import { DocumentModule } from './models/document/document.module';
import { ParagraphModule } from './models/paragraph/paragraph.module';
import { TextModule } from './models/text/text.module';

// Entities
import { UserEntity } from './models/user/user.entity';
import { ConceptEntity } from './models/concept/concept.entity';
import { CorpusEntity } from './models/corpus/corpus.entity';
import { DocumentEntity } from './models/document/document.entity';
import { ParagraphEntity } from './models/paragraph/paragraph.entity';
import { TextEntity } from './models/text/text.entity';

// Configuration
import * as dotenv from 'dotenv';
import { environment } from 'environments/environment';

/*****************************************************************************
 *  DATABASE DEFINITION
 *****************************************************************************/
dotenv.config({ path: '../.env' });
let host, port, username, password, name;

if (process.env.NODE_ENV == 'development') {
	host = environment.database_ip_address;
	port = environment.database_port;
	username = environment.database_user;
	password = environment.database_password;
	name = environment.database_name;
} else if (process.env.NODE_ENV == 'production') {
	host = process.env.HOST_IP_ADDRESS;
	port = parseInt(process.env.DB_PORT);
	username = process.env.DB_USER;
	password = process.env.DB_PASSWORD;
	name = process.env.DB_NAME;
}
// const host = process.env.IP_ADDRESS || environment.database_ip_address;
// const port = parseInt(process.env.DB_PORT) || environment.database_port;
// const username = process.env.DB_USER || environment.database_user;
// const password = process.env.DB_PASSWORD || environment.database_password;
// const name = process.env.DB_NAME || environment.database_name;

/*****************************************************************************
 *  APP DEFINITION
 *****************************************************************************/
@Module({
	imports: [
		UserModule,
		CorpusModule,
		DocumentModule,
		ParagraphModule,
		TextModule,
		ConceptModule,
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: host,
			port: port,
			username: username,
			password: password,
			database: name,
			entities: [UserEntity, CorpusEntity, DocumentEntity, ParagraphEntity, TextEntity, ConceptEntity],
			synchronize: true,
			logging: false,
		}),
	],
	controllers: [AppController],
	providers: [
		// Services
		ConnectionService,

		// Gateways
		AppGateway,
		AuthenticateGateway,
		DashboardGateway,
		EditorGateway,
		ExplorerGateway,
		CorpusGateway,
		DocumentGateway,

		// Controllers
		AuthenticateController,
		DashboardController,
		EditorController,
		ExplorerController,
		CorpusController,
		DocumentController,
	],
})

/*****************************************************************************
 *  APP MODULE
 *****************************************************************************/
export class AppModule {
	private logger: Logger = new Logger('App Module');

	constructor(private readonly connection: Connection) {
		this.logger.log('Initialized!');
	}
}
