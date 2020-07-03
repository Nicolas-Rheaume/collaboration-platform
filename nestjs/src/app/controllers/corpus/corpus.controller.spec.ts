import { Test, TestingModule } from '@nestjs/testing';
import { CorpusController } from './corpus.controller';

describe('Authenticate Controller', () => {
	let controller: CorpusController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CorpusController],
		}).compile();

		controller = module.get<CorpusController>(CorpusController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
