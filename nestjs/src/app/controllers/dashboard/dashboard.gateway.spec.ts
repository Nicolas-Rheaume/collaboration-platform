import { Test, TestingModule } from '@nestjs/testing';
import { DashboardGateway } from './dashboard.gateway';

describe('DashboardGateway', () => {
	let gateway: DashboardGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DashboardGateway],
		}).compile();

		gateway = module.get<DashboardGateway>(DashboardGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
