import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from 'app/entities/document.entity';
import { DocumentModel } from './document.model';
import { UserModel } from '../user/user.model';
import { CorpusModel } from '../corpus/corpus.model';
import { UserEntity } from 'app/entities/user.entity';
import { CorpusEntity } from 'app/entities/corpus.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { TextEntity } from 'app/entities/text.entity';
import { ParagraphModel } from '../paragraph/paragraph.model';
import { TextModel } from '../text/text.model';

@Module({
	imports: [TypeOrmModule.forFeature([DocumentEntity, UserEntity, CorpusEntity, ParagraphEntity, TextEntity])],
	providers: [DocumentModel, UserModel, CorpusModel, ParagraphModel, TextModel],
	controllers: [],
	exports: [DocumentModel, UserModel, CorpusModel, ParagraphModel, TextModel],
})
export class DocumentModule {}
