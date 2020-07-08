import { Test, TestingModule } from '@nestjs/testing';
import { ConceptModel } from './concept.model';

describe('UserService', () => {
	let service: ConceptModel;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ConceptModel],
		}).compile();

		service = module.get<ConceptModel>(ConceptModel);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
