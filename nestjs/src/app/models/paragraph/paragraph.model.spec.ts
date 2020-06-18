import { Test, TestingModule } from '@nestjs/testing';
import { ParagraphModel } from './paragraph.model';

describe('Paragraph.ModelService', () => {
	let service: ParagraphModel;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ParagraphModel],
		}).compile();

		service = module.get<ParagraphModel>(ParagraphModel);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
