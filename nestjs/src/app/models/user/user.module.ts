import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Concept
import { ConceptEntity } from '../concept/concept.entity';
import { ConceptModel } from '../concept/concept.model';

// Corpus
import { CorpusEntity } from '../corpus/corpus.entity';
import { CorpusModel } from '../corpus/corpus.model';

// Document
import { DocumentEntity } from '../document/document.entity';
import { DocumentModel } from '../document/document.model';

// Paragraph
import { ParagraphEntity } from '../paragraph/paragraph.entity';
import { ParagraphModel } from '../paragraph/paragraph.model';

// Text
import { TextEntity } from '../text/text.entity';
import { TextModel } from '../text/text.model';

// User
import { UserEntity } from '../user/user.entity';
import { UserModel } from '../user/user.model';

@Module({
	imports: [TypeOrmModule.forFeature([
		ConceptEntity,
		CorpusEntity,
		DocumentEntity,
		ParagraphEntity,
		TextEntity,
		UserEntity, 
	])],
	providers: [
		ConceptModel,
		CorpusModel, 
		DocumentModel,
		ParagraphModel,
		TextModel,
		UserModel
	],
	controllers: [],
	exports: [
		ConceptModel,
		CorpusModel, 
		DocumentModel,
		ParagraphModel,
		TextModel,
		UserModel
	],
})
export class UserModule {}
