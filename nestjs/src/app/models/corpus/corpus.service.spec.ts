import { Test, TestingModule } from '@nestjs/testing';
import { CorpusModel } from './corpus.model';

describe('UserService', () => {
	let service: CorpusModel;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CorpusModel],
		}).compile();

		service = module.get<CorpusModel>(CorpusModel);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
