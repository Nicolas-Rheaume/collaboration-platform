import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorpusEntity } from 'app/entities/corpus.entity';
import { CorpusModel } from './corpus.model';
import { DocumentEntity } from 'app/entities/document.entity';
import { DocumentModel } from '../document/document.model';
import { UserModel } from '../user/user.model';
import { ParagraphModel } from '../paragraph/paragraph.model';
import { TextModel } from '../text/text.model';
import { UserEntity } from 'app/entities/user.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { TextEntity } from 'app/entities/text.entity';

@Module({
	imports: [TypeOrmModule.forFeature([
		CorpusEntity,
		DocumentEntity,
		UserEntity, 
		CorpusEntity, 
		ParagraphEntity, 
		TextEntity
	])],
	providers: [
		CorpusModel, 
		DocumentModel
	],
	controllers: [],
	exports: [
		CorpusModel,
		DocumentModel
	],
})
export class CorpusModule {}
