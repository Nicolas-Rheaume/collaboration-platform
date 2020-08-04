import { Controller } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionService } from 'app/models/connection/connection.service';
import { DocumentModel } from 'app/models/document/document.model';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { ParagraphModel } from 'app/models/paragraph/paragraph.model';
import { UserEntity } from 'app/models/user/user.entity';
import { CorpusEntity } from 'app/models/corpus/corpus.entity';
import { DocumentEntity, Document } from 'app/models/document/document.entity';
import { TextEntity, Text } from 'app/models/text/text.entity';
import { ParagraphEntity } from 'app/models/paragraph/paragraph.entity';
import { TextModel } from 'app/models/text/text.model';

import * as arrayMove from 'array-move';
import { ConceptEntity, Concept } from 'app/models/concept/concept.entity';
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
			} catch (err) {
				reject(err);
			}
		});
	}

	// Initialize Editor Texts
	public async getDocument(client: Socket, corpusIndex: number, documentIndex: number): Promise<Document> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const documentEntity: DocumentEntity = await this.documentModel
					.findOneByIDWithTexts(this.cs.getConnection(client).explorerConcept.corpora[corpusIndex].documents[documentIndex].id)
					.catch(err => {
						throw err;
					});
				this.cs.getConnection(client).explorerCorpusIndex = corpusIndex;
				this.cs.getConnection(client).explorerDocumentIndex = documentIndex;
				const document: Document = await documentEntity.getDocument();
				resolve(document);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Merge a new text at index
	public async moveTextAtIndex(client: Socket, from: number, to: number): Promise<Document> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				arrayMove.mutate(this.cs.getExplorerDocument(client).paragraphs, from, to);
				resolve(document);
			} catch (err) {
				reject(err);
			}
		});
	}
}
