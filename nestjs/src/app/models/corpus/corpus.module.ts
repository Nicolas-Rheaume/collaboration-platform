import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorpusEntity } from 'app/entities/corpus.entity';
import { CorpusModel } from './corpus.model';

@Module({
	imports: [TypeOrmModule.forFeature([CorpusEntity])],
	providers: [CorpusModel],
	controllers: [],
	exports: [CorpusModel],
})
export class CorpusModule {}
