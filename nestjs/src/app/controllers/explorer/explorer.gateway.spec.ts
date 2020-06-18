import { Test, TestingModule } from '@nestjs/testing';
import { ExplorerGateway } from './explorer.gateway';

describe('ExplorerGateway', () => {
	let gateway: ExplorerGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ExplorerGateway],
		}).compile();

		gateway = module.get<ExplorerGateway>(ExplorerGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
