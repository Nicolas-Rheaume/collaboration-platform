import { Controller } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionService } from 'app/services/connection/connection.service';
import { DocumentModel } from 'app/models/document/document.model';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { ParagraphModel } from 'app/models/paragraph/paragraph.model';
import { UserEntity } from 'app/entities/user.entity';
import { CorpusEntity } from 'app/entities/corpus.entity';
import { DocumentEntity, Document } from 'app/entities/document.entity';
import { TextEntity, Text } from 'app/entities/text.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { TextModel } from 'app/models/text/text.model';

import * as arrayMove from 'array-move';
import { ConceptEntity, Concept } from 'app/entities/concept.entity';
import { ConceptModel } from 'app/models/concept/concept.model';

@Controller('explorer')
export class ExplorerController {
	// Constructor
	constructor(
		private readonly cs: ConnectionService,
		private readonly conceptModel: ConceptModel,
		private readonly corpusModel: CorpusModel,
		private readonly documentModel: DocumentModel,
		private readonly paragraphModel: ParagraphModel,
		private readonly textModel: TextModel,
	) {}

	// Initialize Editor Texts
	public async initialize(client: Socket, url: string): Promise<Concept> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const author: UserEntity = this.cs.getUserEntity(client);
				const conceptEntity: ConceptEntity = await this.conceptModel.findOneByURLWithCorpusWithoutUser(url, author).catch(err => {
					throw err;
				});

				this.cs.getConnection(client).explorerConcept = conceptEntity;
				const concept = await conceptEntity.getConcept();
				resolve(concept);


				// const corpus: CorpusEntity = await this.corpusModel.findOneByTitle(url).catch(err => {
				// 	throw err;
				// });
				// const explorerTextEntities: TextEntity[] = await this.documentModel.findTextsByCorpusWithoutAuthor(corpus, author).catch(err => {
				// 	throw err;
				// });
				// this.cs.getConnection(client).explorerTexts = explorerTextEntities;
				// const explorerTexts = Text.parseEntities(explorerTextEntities);
				// resolve(explorerTexts);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Initialize Editor Texts
	public async getDocument(client: Socket, corpusIndex: number, documentIndex: number): Promise<Document> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const documentEntity: DocumentEntity = await this.documentModel.findOneByIDWithTexts(
					this.cs.getConnection(client).explorerConcept.corpora[corpusIndex].documents[documentIndex].id
				).catch(err => {
					throw err;
				});
				const document: Document = await documentEntity.getDocument();
				resolve(document);
			} catch (err) {
				reject(err);
			}
		});
	}

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
