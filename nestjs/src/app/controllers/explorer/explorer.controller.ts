import { Controller } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionService } from 'app/services/connection/connection.service';
import { DocumentModel } from 'app/models/document/document.model';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { ParagraphModel } from 'app/models/paragraph/paragraph.model';
import { UserEntity } from 'app/entities/user.entity';
import { CorpusEntity } from 'app/entities/corpus.entity';
import { DocumentEntity } from 'app/entities/document.entity';
import { TextEntity, Text } from 'app/entities/text.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { TextModel } from 'app/models/text/text.model';

import * as arrayMove from 'array-move';

@Controller('explorer')
export class ExplorerController {
	// Constructor
	constructor(
		private readonly cs: ConnectionService,
		private readonly corpusModel: CorpusModel,
		private readonly documentModel: DocumentModel,
		private readonly paragraphModel: ParagraphModel,
		private readonly textModel: TextModel,
	) {}

	// // Initialize Editor Texts
	// public async initialize(client: Socket, url: string): Promise<Text[]> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const author: UserEntity = this.cs.getUserEntity(client);
	// 			const corpus: CorpusEntity = await this.corpusModel.findOneByTitle(url).catch(err => {
	// 				throw err;
	// 			});
	// 			const explorerTextEntities: TextEntity[] = await this.documentModel.findTextsByCorpusWithoutAuthor(corpus, author).catch(err => {
	// 				throw err;
	// 			});
	// 			this.cs.getConnection(client).explorerTexts = explorerTextEntities;
	// 			const explorerTexts = Text.parseEntities(explorerTextEntities);
	// 			resolve(explorerTexts);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Merge a new text at index
	// public async moveTextAtIndex(client: Socket, from: number, to: number): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			arrayMove.mutate(this.cs.getConnection(client).explorerTexts, from, to);
	// 			resolve(document);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}
