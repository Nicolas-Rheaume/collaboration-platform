import { Test, TestingModule } from '@nestjs/testing';
import { UserModel } from './user.model';

describe('UserService', () => {
	let service: UserModel;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserModel],
		}).compile();

		service = module.get<UserModel>(UserModel);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
