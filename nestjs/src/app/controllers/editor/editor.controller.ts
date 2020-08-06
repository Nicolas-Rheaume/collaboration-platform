import { Controller } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { Connection, ConnectionService } from 'app/models/connection/connection.service';
import { DocumentModel } from 'app/models/document/document.model';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { ParagraphModel } from 'app/models/paragraph/paragraph.model';
import { UserEntity } from 'app/models/user/user.entity';
import { CorpusEntity, Corpus } from 'app/models/corpus/corpus.entity';
import { DocumentEntity, Document } from 'app/models/document/document.entity';
import { TextEntity } from 'app/models/text/text.entity';
import { ParagraphEntity } from 'app/models/paragraph/paragraph.entity';
import { TextModel } from 'app/models/text/text.model';

import * as arrayMove from 'array-move';
import { ConceptEntity } from 'app/models/concept/concept.entity';
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
				const editorCorpus: CorpusEntity = await this.corpusModel.findOneByConceptAndAuthorID(concept.id, author.id).catch(err => {
					throw err;
				});
				if (editorCorpus == undefined) resolve(null);
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
				const editorCorpus: CorpusEntity = await this.corpusModel.findOneByConceptAndAuthorID(concept.id, author.id).catch(err => {
					throw err;
				});
				if (editorCorpus != undefined) {
					this.cs.getConnection(client).editorCorpus = editorCorpus;
					const editor = await editorCorpus.getCorpus();
					resolve(editor);
				} else {
					const createEditorCorpus: CorpusEntity = await this.corpusModel.createByConceptAndAuthor(concept, author).catch(err => {
						throw err;
					});
					const newEditorCorpus: CorpusEntity = await this.corpusModel.findOneByConceptAndAuthorID(concept.id, author.id).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).editorCorpus = newEditorCorpus;
					const editor = await newEditorCorpus.getCorpus();
					resolve(editor);
				}
			} catch (err) {
				console.log(err);
				reject(err);
			}
		});
	}

	// Update Editor Corpus Description
	public async updateCorpusDescription(client: Socket, description: string): Promise<void> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				this.cs.getConnection(client).editorCorpus.description = description;
				await this.corpusModel.updateDescriptionByID(this.cs.getConnection(client).editorCorpus.id, description).catch(err => {
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
				await this.documentModel.updateTitleByID(this.cs.getConnection(client).editorCorpus.documents[index].id, title).catch(err => {
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
				await this.documentModel.updateDescriptionByID(this.cs.getConnection(client).editorCorpus.documents[index].id, description).catch(err => {
					throw err;
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	// Create a new Document on the corpus
	public async createEmptyDocument(client: Socket): Promise<Corpus> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				// Creating the document
				const documentEntity: DocumentEntity = await this.documentModel
					.createByCorpusandOrder(this.cs.getConnection(client).editorCorpus, this.cs.getConnection(client).editorCorpus.documents.length)
					.catch(err => {
						throw err;
					});

				// Creating the empty text
				const textEntity: TextEntity = await this.textModel.createEmptyByAuthor(this.cs.getConnection(client).userEntity).catch(err => {
					throw err;
				});

				// Creating the paragraph
				const paragraphEntity: ParagraphEntity = await this.paragraphModel.create(documentEntity, textEntity, 0).catch(err => {
					throw err;
				});

				const documentEntities: DocumentEntity[] = await this.documentModel.findDocumentsByCorpusID(this.cs.getConnection(client).editorCorpus.id).catch(err => {
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

	// Create a new Document on the corpus
	public async createDocument(client: Socket, title: string, description: string): Promise<Corpus> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				// Creating the document
				const documentEntity: DocumentEntity = await this.documentModel
					.createByTitleDescriptionCorpusandOrder(
						title, 
						description,
						this.cs.getConnection(client).editorCorpus, 
						this.cs.getConnection(client).editorCorpus.documents.length)
					.catch(err => {
						throw err;
					});

				// Creating the empty text
				const textEntity: TextEntity = await this.textModel.createEmptyByAuthor(this.cs.getConnection(client).userEntity).catch(err => {
					throw err;
				});

				// Creating the paragraph
				const paragraphEntity: ParagraphEntity = await this.paragraphModel.create(documentEntity, textEntity, 0).catch(err => {
					throw err;
				});

				const documentEntities: DocumentEntity[] = await this.documentModel.findDocumentsByCorpusID(this.cs.getConnection(client).editorCorpus.id).catch(err => {
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

	// Create a new Document on the corpus
	public async editDocumentAtIndex(client: Socket, index: number, title: string, description: string): Promise<Corpus> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				console.log(index);

				if(index >= this.cs.getConnection(client).editorCorpus.documents.length || index < 0) { reject("Index out of bound"); }
				else {
					await this.documentModel.updateTitleandDescriptionByID(
						this.cs.getConnection(client).editorCorpus.documents[index].id, 
						title, 
						description
					).catch(err => {
						throw err;
					});

					const documentEntities: DocumentEntity[] = await this.documentModel.findDocumentsByCorpusID(this.cs.getConnection(client).editorCorpus.id).catch(err => {
						throw err;
					});
					this.cs.getConnection(client).editorCorpus.documents = documentEntities;
					const editor = await this.cs.getConnection(client).editorCorpus.getCorpus();
					resolve(editor);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	// Create a new Document on the corpus
	public async deleteDocumentAtIndex(client: Socket, index: number): Promise<Corpus> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				// Get the Document
				const documentEntity: DocumentEntity = await this.documentModel
					.findOneByID(
						this.cs.getConnection(client).editorCorpus.documents[index].id
					).catch(err => {
					throw err;
				});

				// Delete Paragraphs
				await this.paragraphModel.deleteAllByDocument(documentEntity).catch(err => {
					throw err;
				});

				const segmentDocumentEntities: DocumentEntity[] = this.cs.getConnection(client).editorCorpus.documents.slice(index + 1);

				// Delete Document
				await this.documentModel.deleteByID(documentEntity.id).catch(err => {
					throw err;
				});

				// Update Orders
				await this.documentModel.updateOrdersAtIndex(segmentDocumentEntities, index).catch(err => {
					throw err;
				});

				const documentEntities: DocumentEntity[] = await this.documentModel.findDocumentsByCorpusID(this.cs.getConnection(client).editorCorpus.id).catch(err => {
					throw err;
				});
				this.cs.getConnection(client).editorCorpus.documents = documentEntities;
				const editor = await this.cs.getConnection(client).editorCorpus.getCorpus();
				resolve(editor);
			} catch (err) {
				console.log(err);
				reject(err);
			}
		});
	}

	// Update Editor Corpus Description
	public async getDocument(client: Socket, index: number): Promise<Document> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const documentEntity: DocumentEntity = await this.documentModel.findOneByCorpusIDAndOrderWithTexts(
					this.cs.getConnection(client).editorCorpus.id, 
					index
				).catch(err => {
					throw err;
				});
				this.cs.getConnection(client).editorDocumentIndex = index;
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
				this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex].text.newText = text;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	// Save document at index TODO
	public async saveDocumentAtIndex(client: Socket, documentIndex: number): Promise<void> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.forEach(async(paragraph, i) => {
					if(paragraph.text.text != paragraph.text.newText) {
						if(paragraph.text.id >= 0) {
							const textEntity = await this.textModel.createFollowingText(
								paragraph.text,
								this.cs.getConnection(client).userEntity
							).catch(err => {
								throw err;
							});

							await this.paragraphModel.updateText(
								paragraph.id,
								textEntity
							).catch(err => {
								throw err;
							});
						} else {

						}
					}
				});
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
				this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs[textIndex].text.newText = firstText;

				await this.paragraphModel.updateOrdersAtIndex(
					this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.slice(textIndex + 1),
					textIndex + 2
				).catch(err => {
					throw err;
				});

				const newTextEntity = await this.textModel.create(
					secondText, 
					this.cs.getConnection(client).userEntity
				).catch(err => {
					throw err;
				});
				let newParagraphEntity = await this.paragraphModel.create(
					this.cs.getConnection(client).editorCorpus.documents[documentIndex], 
					newTextEntity, 
					textIndex + 1
				).catch(err => {
					throw err;
				});
				newParagraphEntity.text = newTextEntity;
				this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.splice(textIndex + 1, 0, newParagraphEntity);
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
				this.paragraphModel.updateOrdersAtIndex(
					this.cs.getConnection(client).editorCorpus.documents[documentIndex].paragraphs.slice(textIndex),
					textIndex
				).catch(err => {
					throw err;
				});
				resolve(document);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Move document at index
	public async moveDocumentAtIndex(client: Socket, from: number, to: number): Promise<Document> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				arrayMove.mutate(this.cs.getConnection(client).editorCorpus.documents, from, to);
				const min = Math.min(from, to);
				const max = Math.max(from, to);
				const documentEntities: DocumentEntity[] = this.cs.getConnection(client).editorCorpus.documents.slice(min, max + 1);
				await this.documentModel.updateOrdersAtIndex(documentEntities, min).catch(err => {
					throw err;
				});
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
				arrayMove.mutate(this.cs.getEditorDocument(client).paragraphs, from, to);
				const min = Math.min(from, to);
				const max = Math.max(from, to);

				for (let i = min; i <= max; i++) {
					await this.paragraphModel.updateOrderByID(this.cs.getEditorDocument(client).paragraphs[i].id, i);
				}
				resolve(document);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Adopt Explorer Text
	public async adoptDocumentAtIndex(client: Socket, from: number, to: number, corpusID: number): Promise<void> {
		return new Promise<any>(async (resolve, reject) => {
			try {

				// this.cs.getConnection(client).editorCorpus.documents.splice(to, 0, 
				// 	this.cs.getConnection(client).explorerConcept.corpora[corpusID].documents[from]
				// );

				await this.documentModel.updateOrdersAtIndex(
					this.cs.getConnection(client).editorCorpus.documents.slice(to),
					to
				).catch(err => {
					throw err;
				});

				await this.documentModel.copyOneToCorpusAtIndex(
					this.cs.getConnection(client).explorerConcept.corpora[corpusID].documents[from],
					this.cs.getConnection(client).editorCorpus,
					to
				).catch(err => {
					throw err;
				});

				const documentEntities: DocumentEntity[] = await this.documentModel.findDocumentsByCorpusID(this.cs.getConnection(client).editorCorpus.id).catch(err => {
					throw err;
				});
				this.cs.getConnection(client).editorCorpus.documents = documentEntities;
				const editor = await this.cs.getConnection(client).editorCorpus.getCorpus();
				resolve(editor);



				// const author: UserEntity = this.cs.getUserEntity(client);
				// const connection: Connection = this.cs.getConnection(client);
				// const explorerDocument: DocumentEntity = await this.documentModel.findOneByIDWithTexts(this.cs.getExplorerDocument(client).id).catch(err => {
				// 	throw err;
				// });
				// const text: TextEntity = await this.textModel.createByEntity(explorerDocument.paragraphs[from].text).catch(err => {
				// 	throw err;
				// });
				// let paragraph: ParagraphEntity = await this.paragraphModel.create(this.cs.getEditorDocument(client), text, to).catch(err => {
				// 	throw err;
				// });
				// paragraph.text = text;

				// this.cs.getEditorDocument(client).paragraphs.splice(to, 0, paragraph);

				// for (let i = to + 1; i < this.cs.getEditorDocument(client).paragraphs.length; i++) {
				// 	await this.paragraphModel.updateOrderByID(this.cs.getEditorDocument(client).paragraphs[i].id, i);
				// }

				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	// Adopt Explorer Text
	public async adoptTextAtIndex(client: Socket, from: number, to: number): Promise<void> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const paragraph: ParagraphEntity = await this.paragraphModel.create(
					this.cs.getEditorDocument(client), 
					this.cs.getExplorerDocument(client).paragraphs[from].text, 
					to
				).catch(err => {
					throw err;
				});

				this.cs.getEditorDocument(client).paragraphs.splice(to, 0, paragraph);

				for (let i = to + 1; i < this.cs.getEditorDocument(client).paragraphs.length; i++) {
					await this.paragraphModel.updateOrderByID(this.cs.getEditorDocument(client).paragraphs[i].id, i);
				}
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

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
