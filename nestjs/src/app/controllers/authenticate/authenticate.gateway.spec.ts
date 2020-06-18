import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateGateway } from './authenticate.gateway';

describe('AuthenticateGateway', () => {
	let gateway: AuthenticateGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthenticateGateway],
		}).compile();

		gateway = module.get<AuthenticateGateway>(AuthenticateGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
