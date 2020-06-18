import { Test, TestingModule } from '@nestjs/testing';
import { EditorGateway } from './editor.gateway';

describe('EditorGateway', () => {
	let gateway: EditorGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [EditorGateway],
		}).compile();

		gateway = module.get<EditorGateway>(EditorGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
