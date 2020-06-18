import { Test, TestingModule } from '@nestjs/testing';
import { DocumentModel } from './document.model';

describe('UserService', () => {
	let service: DocumentModel;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DocumentModel],
		}).compile();

		service = module.get<DocumentModel>(DocumentModel);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
