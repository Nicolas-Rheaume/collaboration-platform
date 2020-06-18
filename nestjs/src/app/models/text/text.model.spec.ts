import { Test, TestingModule } from '@nestjs/testing';
import { TextEntity } from './text.model';

describe('Text.ModelService', () => {
	let service: TextEntity;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TextEntity],
		}).compile();

		service = module.get<TextEntity>(TextEntity);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
