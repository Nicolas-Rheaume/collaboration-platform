import { Test, TestingModule } from '@nestjs/testing';
import { CorpusGateway } from './corpus.gateway';

describe('AuthenticateGateway', () => {
	let gateway: CorpusGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CorpusGateway],
		}).compile();

		gateway = module.get<CorpusGateway>(CorpusGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
