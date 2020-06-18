/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { Controller, Get, Render, Logger, Res } from '@nestjs/common';
import { Router, Request, Response } from 'express';

// Controllers
import { AuthenticateController } from 'app/controllers/authenticate/authenticate.controller';

/*****************************************************************************
 *  APP CONTROLLER
 *****************************************************************************/
@Controller()
export class AppController {
	// Variables
	private logger: Logger = new Logger('App Controller');

	// Constructor
	constructor(private readonly authController: AuthenticateController) {
		this.logger.log('Initialized!');
	}

	// Request
	@Get('/')
	public async renderIndex(@Res() res: Response): Promise<void> {
		res.sendFile('index.html', {
			root: './src/assets',
		});
	}
}
