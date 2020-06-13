/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

// Services
import { ConnectionService } from './services/connection/connection.service';

// Gateways
import { AppGateway } from './app.gateway';
import { AuthenticateGateway } from './controllers/authenticate/authenticate.gateway';
import { DashboardGateway } from './controllers/dashboard/dashboard.gateway';

// Controllers
import { AppController } from './app.controller';
import { AuthenticateController } from './controllers/authenticate/authenticate.controller';
import { DashboardController } from './controllers/dashboard/dashboard.controller';

// Modules
import { UserModule } from './models/user/user.module';
import { CorpusModule } from './models/corpus/corpus.module';

// Entities
import { UserEntity } from './entities/user.entity';
import { CorpusEntity } from './entities/corpus.entity';

// Configuration
import { environment } from 'environments/environment';

/*****************************************************************************
 *  DATABASE DEFINITION
 *****************************************************************************/
const host = process.env.IP_ADDRESS || environment.database_ip_address;
const port = parseInt(process.env.DB_PORT) || environment.database_port;
const username = process.env.DB_USER || environment.database_user;
const password = process.env.DB_PASSWORD || environment.database_password;
const name = process.env.DB_NAME || environment.database_name;

/*****************************************************************************
 *  APP DEFINITION
 *****************************************************************************/
@Module({
	imports: [
		UserModule,
		CorpusModule,
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: host,
			port: port,
			username: username,
			password: password,
			database: name,
			entities: [UserEntity, CorpusEntity],
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

		// Controllers
		AuthenticateController,
		DashboardController,
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
