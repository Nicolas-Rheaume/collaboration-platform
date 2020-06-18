import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'app/entities/user.entity';
import { UserModel } from './user.model';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UserModel],
	controllers: [],
	exports: [UserModel],
})
export class UserModule {}
