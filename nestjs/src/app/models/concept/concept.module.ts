import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptEntity } from 'app/entities/concept.entity';
import { ConceptModel } from './concept.model';

@Module({
	imports: [TypeOrmModule.forFeature([ConceptEntity])],
	providers: [ConceptModel],
	controllers: [],
	exports: [ConceptModel],
})
export class ConceptModule {}
