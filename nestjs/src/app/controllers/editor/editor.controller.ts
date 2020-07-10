import { Controller } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionService } from 'app/services/connection/connection.service';
import { DocumentModel } from 'app/models/document/document.model';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { ParagraphModel } from 'app/models/paragraph/paragraph.model';
import { UserEntity } from 'app/entities/user.entity';
import { CorpusEntity, Corpus } from 'app/entities/corpus.entity';
import { DocumentEntity, Document } from 'app/entities/document.entity';
import { TextEntity } from 'app/entities/text.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { TextModel } from 'app/models/text/text.model';

import * as arrayMove from 'array-move';
import { Connection } from 'app/entities/connection.entity';
import { ConceptEntity } from 'app/entities/concept.entity';
import { ConceptModel } from 'app/models/concept/concept.model';

@Controller('editor')
export class EditorController {
	// Constructor
	constructor(
		private readonly cs: ConnectionService,
		private readonly conceptModel: ConceptModel,
		private readonly corpusModel: CorpusModel,
		private readonly documentModel: DocumentModel,
		private readonly paragraphModel: ParagraphModel,
		private readonly textModel: TextModel,
	) {}

		// Initialize Editor Corpus
		public async initialize(client: Socket, url: string): Promise<Corpus> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					const author: UserEntity = this.cs.getUserEntity(client);
					const concept: ConceptEntity = await this.conceptModel.findOneByURL(url).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).conceptTitle = concept.title;
					const editorCorpus: CorpusEntity = await this.corpusModel.findOneByConceptAndAuthorID(author.id, concept.id).catch(err => {
						throw err;
					});
					if(editorCorpus == undefined) resolve(null);
					else {
						this.cs.getConnection(client).editorCorpus = editorCorpus;
						const editor = await editorCorpus.getCorpus();
						resolve(editor);
					}
				} catch (err) {
					reject(err);
				}
			});
		}	

		// Create Editor Corpus
		public async createCorpus(client: Socket): Promise<Corpus> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					const author: UserEntity = this.cs.getUserEntity(client);
					const concept: ConceptEntity = await this.conceptModel.findOneByTitle(this.cs.getConnection(client).conceptTitle).catch(err => {
						throw err;
					});
					const editorCorpus: CorpusEntity = await this.corpusModel.UpsertByAuthorAndConcept(author, concept).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).editorCorpus = editorCorpus;
					const editor = await editorCorpus.getCorpus();
					resolve(editor);
				} catch (err) {
					reject(err);
				}
			});
		}	

		// Update Editor Corpus Description
		public async updateCorpusDescription(client: Socket, description: string): Promise<void> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					this.cs.getConnection(client).editorCorpus.description = description;
					await this.corpusModel
						.updateDescriptionByID(
							this.cs.getConnection(client).editorCorpus.id,
							description
						).catch(err => {
						throw err;
					});
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		}	

		// Update Editor Corpus Description
		public async updateDocumentTitle(client: Socket, index: number, title: string): Promise<void> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					this.cs.getConnection(client).editorCorpus.documents[index].title = title;
					await this.documentModel
						.updateTitleByID(
							this.cs.getConnection(client).editorCorpus.documents[index].id,
							title
						).catch(err => {
						throw err;
					});
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		}	

		// Update Editor Corpus Description
		public async updateDocumentDescription(client: Socket, index: number, description: string): Promise<void> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					this.cs.getConnection(client).editorCorpus.documents[index].description = description;
					await this.documentModel
						.updateDescriptionByID(
							this.cs.getConnection(client).editorCorpus.documents[index].id,
							description
						).catch(err => {
						throw err;
					});
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		}	

		// Create a new Document on the corpus
		public async createDocument(client: Socket): Promise<Corpus> {
			return new Promise<any>(async (resolve, reject) => {
				try {

					// Creating the document
					const documentEntity: DocumentEntity = await this.documentModel.createByCorpusandOrder(
						this.cs.getConnection(client).editorCorpus,
						this.cs.getConnection(client).editorCorpus.documents.length
					).catch(err => {
						throw err;
					});

					// Creating the empty text
					const textEntity: TextEntity = await this.textModel.createEmptyByAuthor(this.cs.getConnection(client).userEntity).catch(err => {
						throw err;
					});

					// Creating the paragraph
					const paragraphEntity: ParagraphEntity = await this.paragraphModel.create(
						documentEntity,
						textEntity,
						0
					).catch(err => {
						throw err;
					});

					const documentEntities: DocumentEntity[] = 
						await this.documentModel
							.findDocumentsByCorpusID(
								this.cs.getConnection(client).editorCorpus.id
							).catch(err => {
						throw err;
					});					
					this.cs.getConnection(client).editorCorpus.documents = documentEntities;
					const editor = await this.cs.getConnection(client).editorCorpus.getCorpus();
					resolve(editor);
				} catch (err) {
					reject(err);
				}
			});
		}	

		// Update Editor Corpus Description
		public async getDocument(client: Socket, index: number): Promise<Document> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					const documentEntity: DocumentEntity = await this.documentModel
						.findOneByCorpusIDAndOrderWithTexts(
							this.cs.getConnection(client).editorCorpus.id,
							index
					).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).editorCorpus.documents[index] = documentEntity;
					const document: Document = await documentEntity.getDocument().catch(err => {
						throw err;
					});
					resolve(document);
				} catch (err) {
					reject(err);
				}
			});
		}	
	
		// Update a text at index
		public async updateTextAtIndex(client: Socket, documentIndex: number, textIndex: number, text: string): Promise<void> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					const id = this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex].text.id;
					const textEntity = await this.textModel.updateByID(id, text).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex].text = textEntity;
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		}
	
		// Split Text at index
		public async splitTextAtIndex(client: Socket, documentIndex: number, textIndex: number, firstText: string, secondText: string): Promise<Document> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					const firstID = this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex].text.id;
					const textEntity = await this.textModel.updateByID(firstID, firstText).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex].text = textEntity;
	
					const author = this.cs.getUserEntity(client);
					const document = this.cs.getConnection(client).editorCorpus.documents[documentIndex];
					const newTextEntity = await this.textModel.create(secondText, author).catch(err => {
						throw err;
					});
					let newParagraphEntity = await this.paragraphModel.create(document, newTextEntity, textIndex + 1).catch(err => {
						throw err;
					});
	
					newParagraphEntity.text = newTextEntity;
	
					this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.splice(textIndex + 1, 0, newParagraphEntity);
	
					for (let i = textIndex + 2; i < this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.length; i++) {
						await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[i].id, i);
					}
	
					resolve();
				} catch (err) {
					reject(err);
				}
			});
		}
	
		// Merge a new text at index
		public async mergeTextAtIndex(client: Socket, documentIndex: number, textIndex: number): Promise<Document> {
			return new Promise<any>(async (resolve, reject) => {
				try {
					const paragraph = this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex];
					await this.paragraphModel.deleteByID(paragraph.id).catch(err => {
						throw err;
					});
	
					this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.splice(textIndex, 1);
	
					for (let i = textIndex; i < this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.length; i++) {
						await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[i].id, i);
					}
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
		// 			arrayMove.mutate(this.cs.getConnection(client).editorEntity.paragraphs, from, to);
		// 			const min = Math.min(from, to);
		// 			const max = Math.max(from, to);
	
		// 			for (let i = min; i <= max; i++) {
		// 				await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorEntity.paragraphs[i].id, i);
		// 			}
		// 			resolve(document);
		// 		} catch (err) {
		// 			reject(err);
		// 		}
		// 	});
		// }
	
		// // Adopt Explorer Text
		// public async adoptTextAtIndex(client: Socket, from: number, to: number): Promise<void> {
		// 	return new Promise<any>(async (resolve, reject) => {
		// 		try {
		// 			const author: UserEntity = this.cs.getUserEntity(client);
		// 			const connection: Connection = this.cs.getConnection(client);
		// 			const text: TextEntity = await this.textModel.createByEntity(connection.explorerTexts[from]).catch(err => {
		// 				throw err;
		// 			});
		// 			let paragraph: ParagraphEntity = await this.paragraphModel.create(connection.editorEntity, text, to).catch(err => {
		// 				throw err;
		// 			});
		// 			paragraph.text = text;
	
		// 			this.cs.getConnection(client).editorEntity.paragraphs.splice(to, 0, paragraph);
	
		// 			for (let i = to + 1; i < this.cs.getConnection(client).editorEntity.paragraphs.length; i++) {
		// 				await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorEntity.paragraphs[i].id, i);
		// 			}
	
		// 			resolve();
		// 		} catch (err) {
		// 			reject(err);
		// 		}
		// 	});
		// }

	// // Initialize Editor Texts
	// public async initialize(client: Socket, url: string): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const author: UserEntity = this.cs.getUserEntity(client);
	// 			const corpus: CorpusEntity = await this.corpusModel.findOneByURL(url).catch(err => {
	// 				throw err;
	// 			});

	// 			let editorEntity: DocumentEntity = await this.documentModel.UpsertByAuthorAndCorpus(author, corpus).catch(err => {
	// 				throw err;
	// 			});
	// 			editorEntity.paragraphs = await this.paragraphModel.findByDocumentWithText(editorEntity).catch(err => {
	// 				throw err;
	// 			});

	// 			if (editorEntity.paragraphs.length === 0) {
	// 				const newTextEntity = await this.textModel.create('', author).catch(err => {
	// 					throw err;
	// 				});
	// 				const newParagraphEntity = await this.paragraphModel.create(editorEntity, newTextEntity, 0).catch(err => {
	// 					throw err;
	// 				});
	// 				editorEntity.paragraphs = [newParagraphEntity];
	// 			}
	// 			this.cs.getConnection(client).editorEntity = editorEntity;
	// 			const editor = await editorEntity.getDocument();
	// 			resolve(editor);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Update a text at index
	// public async updateTextAtIndex(client: Socket, index: number, text: string): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const id = this.cs.getConnection(client).editorEntity.paragraphs[index].text.id;
	// 			const textEntity = await this.textModel.updateByID(id, text).catch(err => {
	// 				throw err;
	// 			});
	// 			this.cs.getConnection(client).editorEntity.paragraphs[index].text = textEntity;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Split Text at index
	// public async splitTextAtIndex(client: Socket, index: number, firstText: string, secondText: string): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const firstID = this.cs.getConnection(client).editorEntity.paragraphs[index].text.id;
	// 			const textEntity = await this.textModel.updateByID(firstID, firstText).catch(err => {
	// 				throw err;
	// 			});
	// 			this.cs.getConnection(client).editorEntity.paragraphs[index].text = textEntity;

	// 			const author = this.cs.getUserEntity(client);
	// 			const document = this.cs.getConnection(client).editorEntity;
	// 			const newTextEntity = await this.textModel.create(secondText, author).catch(err => {
	// 				throw err;
	// 			});
	// 			let newParagraphEntity = await this.paragraphModel.create(document, newTextEntity, index + 1).catch(err => {
	// 				throw err;
	// 			});

	// 			newParagraphEntity.text = newTextEntity;

	// 			this.cs.getConnection(client).editorEntity.paragraphs.splice(index + 1, 0, newParagraphEntity);

	// 			for (let i = index + 2; i < this.cs.getConnection(client).editorEntity.paragraphs.length; i++) {
	// 				await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorEntity.paragraphs[i].id, i);
	// 			}

	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Merge a new text at index
	// public async mergeTextAtIndex(client: Socket, index: number): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const paragraph = this.cs.getConnection(client).editorEntity.paragraphs[index];
	// 			await this.paragraphModel.deleteByID(paragraph.id).catch(err => {
	// 				throw err;
	// 			});

	// 			this.cs.getConnection(client).editorEntity.paragraphs.splice(index, 1);

	// 			for (let i = index; i < this.cs.getConnection(client).editorEntity.paragraphs.length; i++) {
	// 				await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorEntity.paragraphs[i].id, i);
	// 			}
	// 			resolve(document);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Merge a new text at index
	// public async moveTextAtIndex(client: Socket, from: number, to: number): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			arrayMove.mutate(this.cs.getConnection(client).editorEntity.paragraphs, from, to);
	// 			const min = Math.min(from, to);
	// 			const max = Math.max(from, to);

	// 			for (let i = min; i <= max; i++) {
	// 				await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorEntity.paragraphs[i].id, i);
	// 			}
	// 			resolve(document);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Adopt Explorer Text
	// public async adoptTextAtIndex(client: Socket, from: number, to: number): Promise<void> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const author: UserEntity = this.cs.getUserEntity(client);
	// 			const connection: Connection = this.cs.getConnection(client);
	// 			const text: TextEntity = await this.textModel.createByEntity(connection.explorerTexts[from]).catch(err => {
	// 				throw err;
	// 			});
	// 			let paragraph: ParagraphEntity = await this.paragraphModel.create(connection.editorEntity, text, to).catch(err => {
	// 				throw err;
	// 			});
	// 			paragraph.text = text;

	// 			this.cs.getConnection(client).editorEntity.paragraphs.splice(to, 0, paragraph);

	// 			for (let i = to + 1; i < this.cs.getConnection(client).editorEntity.paragraphs.length; i++) {
	// 				await this.paragraphModel.updateOrderByID(this.cs.getConnection(client).editorEntity.paragraphs[i].id, i);
	// 			}

	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}
