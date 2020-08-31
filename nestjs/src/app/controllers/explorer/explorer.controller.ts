import { Controller } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionService } from 'app/models/connection/connection.service';
import { DocumentModel } from 'app/models/document/document.model';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { ParagraphModel } from 'app/models/paragraph/paragraph.model';
import { UserEntity } from 'app/models/user/user.entity';
import { CorpusEntity } from 'app/models/corpus/corpus.entity';
import { DocumentEntity, Document } from 'app/models/document/document.entity';
import { TextEntity, Text, TextType } from 'app/models/text/text.entity';
import { ParagraphEntity } from 'app/models/paragraph/paragraph.entity';
import { TextModel } from 'app/models/text/text.model';

import * as arrayMove from 'array-move';
import * as jsdiff from 'diff';
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

	// Update Editor Corpus Description
	public async getDocumentDiff(client: Socket, editorDocumentIndex: number, explorerCorpusIndex: number, explorerDocumentIndex: number): Promise<Document> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				this.cs.getConnection(client).editorDocumentIndex = editorDocumentIndex;
				this.cs.getConnection(client).explorerCorpusIndex = explorerCorpusIndex;
				this.cs.getConnection(client).explorerDocumentIndex = editorDocumentIndex;

				const editorDocument: DocumentEntity = await this.documentModel
					.findOneByIDWithTexts(
						this.cs.getConnection(client).editorCorpus.documents[editorDocumentIndex].id
					).catch(err => {
						throw err;
					});
				const explorerDocument: DocumentEntity = await this.documentModel
					.findOneByIDWithTexts(
						this.cs.getConnection(client).explorerConcept.corpora[explorerCorpusIndex].documents[explorerDocumentIndex].id
					).catch(err => {
						throw err;
					});
				
				let editorTexts: TextEntity[] = await editorDocument.getTextEntities();
				let explorerTexts: TextEntity[] = await explorerDocument.getTextEntities();
				let results: TextEntity[] = new Array<TextEntity>(editorTexts.length);
				let insertIndex = [];
				let check = true;

				while(check) {
					check = false;
					let promises = new Array(explorerTexts.length);
					for(let i = 0; i < promises.length; i++) {
						if(explorerTexts[i] == null) promises[i] = null;
						else {
							promises[i] = this.textModel.findOneByIDWithPrevious(explorerTexts[i].id).catch(err => {
								throw err;
							});
						}
					}
					await Promise.all(promises).then((data) => {
						for(let i = 0; i < editorTexts.length; i++) {
							for(let j = 0; j < data.length; j++) {
								if(data[j] != null) {
									if(editorTexts[i].id === data[j].id) {
										results[i] = explorerDocument.paragraphs[j].text;
										results[i].refIndex = i;
										insertIndex.push({editor: i, explorer: j});
									}
								}
							}
						}

						for(let i = 0; i < data.length; i++) {
							if(data[i] != null) {
								explorerTexts[i] = data[i].previousText;
								if(explorerTexts[i] != null) {
									check = true;
								}
							}
						}
					});
				}
				for(let i = 0; i < results.length; i++) {
					if(results[i] === undefined) {
						results[i] = editorTexts[i];
						results[i].text = "<span class='text-danger'>" + results[i].text + "</span>";
						results[i].type = TextType.REMOVED;
						results[i].refIndex = i;
					} else {
						// Using the diff library to compare the two texts
						let diff = jsdiff.diffWords(
							editorTexts[i].text,
							results[i].text
						);
			
						// Color code the diff text
						results[i].text = '';
						results[i].type = TextType.DIFF;
						results[i].refIndex = i;
						for(let k = 0; k < diff.length; k++) {
							if (diff[k].added === true) 
								results[i].text += "<span class='text-success'>" + diff[k].value + "</span>";
							else if (diff[k].removed === true) 
								results[i].text += "<span class='text-danger'>" + diff[k].value + "</span>";
							else 
								results[i].text += "<span>" + diff[k].value + "</span>";
						}	
					}
				}

				insertIndex.sort((a,b) => {
					return a.explorer - b.explorer;
				})

				let j = insertIndex.length - 1;
				for(let i = explorerDocument.paragraphs.length - 1; i >= 0; i--) {
					if(insertIndex[j].explorer != i) {
						let newText: TextEntity = await explorerDocument.paragraphs[i].text;
						newText.text = "<span class='text-success'>" + newText.text + "</span>";
						newText.type = TextType.ADDED;
						newText.refIndex = insertIndex[j].editor + 1;
						results.splice( insertIndex[j].editor + 1, 0, newText );
					} else {
						j--;
					}
				}

				for(let i = 0; i < results.length; i++) {
					this.cs.getConnection(client).explorerConcept.corpora[explorerCorpusIndex].documents[explorerDocumentIndex].diffTexts.push(
						new TextEntity(
							results[i].id,
							results[i].text,
							results[i].newText,
							results[i].type,
							results[i].refIndex,
							results[i].tag,
							results[i].html,
							results[i].author,
							results[i].previousText,
							results[i].family,
							results[i].depth,
							results[i].pointer,
							results[i].branches,
							results[i].createdAt,
							results[i].updatedAt
						)
					);
				}

				//this.cs.getConnection(client).explorerConcept.corpora[explorerCorpusIndex].documents[explorerDocumentIndex].diffTexts = results;
				let document: Document = await this.cs.getConnection(client).explorerConcept.corpora[explorerCorpusIndex].documents[explorerDocumentIndex].getDocument();
				document.texts = await Text.parseEntities(results);

				//console.log(results);
				// console.log(this.cs.getConnection(client).explorerConcept.corpora[explorerCorpusIndex].documents[explorerDocumentIndex]);
				// console.log(this.cs.getConnection(client).explorerConcept.corpora[explorerCorpusIndex].documents[explorerDocumentIndex].diffTexts);

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

	// Update Diff Text
	public async updateDiffText(client: Socket, from: number, to: number): Promise<[Document, number, Document, number, number]> {
		return new Promise<any>(async (resolve, reject) => {
			try {

				// Saving other texts
				this.cs.getEditorDocument(client).paragraphs.forEach(async(paragraph, i) => {
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

				// Update the paragraph
				const textEntity: TextEntity = await this.textModel.findOneByID(
					this.cs.getExplorerDocument(client).diffTexts[from].id
				).catch(err => {
					throw err;
				});

				const documentEditorEntity: DocumentEntity = await this.documentModel
					.findOneByIDWithTexts(this.cs.getEditorDocument(client).id)
					.catch(err => {
						throw err;
					});

				await this.paragraphModel.updateText(
					documentEditorEntity.paragraphs[to].id,
					textEntity
				).catch(err => {
					throw err;
				});

				// Get Editing Document
				const editorDocumentEntity: DocumentEntity = await this.documentModel.findOneByCorpusIDAndOrderWithTexts(
					this.cs.getConnection(client).editorCorpus.id, 
					this.cs.getConnection(client).editorDocumentIndex
				).catch(err => {
					throw err;
				});
				this.cs.getConnection(client).editorCorpus.documents[this.cs.getConnection(client).editorDocumentIndex] = editorDocumentEntity;
				const editorDocument: Document = await editorDocumentEntity.getDocument().catch(err => {
					throw err;
				});

				// Get Explorer Document
				const explorerDocument: Document = await this.getDocumentDiff(
					client, 
					this.cs.getConnection(client).editorDocumentIndex, 
					this.cs.getConnection(client).explorerCorpusIndex, 
					this.cs.getConnection(client).explorerDocumentIndex
				);
				resolve([editorDocument, this.cs.getConnection(client).editorDocumentIndex, explorerDocument, this.cs.getConnection(client).explorerCorpusIndex, this.cs.getConnection(client).explorerDocumentIndex]);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Merge a new text at index
	public async addDiffText(client: Socket, from: number, to: number): Promise<[Document, number, Document, number, number]> {
		return new Promise<any>(async (resolve, reject) => {
			try {

				// Saving other texts
				this.cs.getEditorDocument(client).paragraphs.forEach(async(paragraph, i) => {
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

				// Add the paragraph
				const textEntity: TextEntity = await this.textModel.findOneByID(
					this.cs.getExplorerDocument(client).diffTexts[from].id
				).catch(err => {
					throw err;
				});

				const documentEditorEntity: DocumentEntity = await this.documentModel
					.findOneByIDWithTexts(this.cs.getEditorDocument(client).id)
					.catch(err => {
						throw err;
					});

				await this.paragraphModel.updateOrdersAtIndex(
					this.cs.getEditorDocument(client).paragraphs.slice(to),
					to + 1
				).catch(err => {
					throw err;
				});

				// Create the new paragraph
				const newParagraphEntity = await this.paragraphModel.create(
					this.cs.getEditorDocument(client), 
					textEntity, 
					to
				).catch(err => {
					throw err;
				});


				// Get Editing Document
				const editorDocumentEntity: DocumentEntity = await this.documentModel.findOneByCorpusIDAndOrderWithTexts(
					this.cs.getConnection(client).editorCorpus.id, 
					this.cs.getConnection(client).editorDocumentIndex
				).catch(err => {
					throw err;
				});
				this.cs.getConnection(client).editorCorpus.documents[this.cs.getConnection(client).editorDocumentIndex] = editorDocumentEntity;
				const editorDocument: Document = await editorDocumentEntity.getDocument().catch(err => {
					throw err;
				});

				// Get Explorer Document
				const explorerDocument: Document = await this.getDocumentDiff(
					client, 
					this.cs.getConnection(client).editorDocumentIndex, 
					this.cs.getConnection(client).explorerCorpusIndex, 
					this.cs.getConnection(client).explorerDocumentIndex
				);
				resolve([editorDocument, this.cs.getConnection(client).editorDocumentIndex, explorerDocument, this.cs.getConnection(client).explorerCorpusIndex, this.cs.getConnection(client).explorerDocumentIndex]);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Merge a new text at index
	public async removeDiffText(client: Socket, from: number, to: number): Promise<[Document, number, Document, number, number]> {
		return new Promise<any>(async (resolve, reject) => {
			try {

				// Saving other texts
				this.cs.getEditorDocument(client).paragraphs.forEach(async(paragraph, i) => {
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

				await this.paragraphModel.updateOrdersAtIndex(
					this.cs.getEditorDocument(client).paragraphs.slice(to + 1),
					to
				).catch(err => {
					throw err;
				});


				await this.paragraphModel.deleteByID(
					this.cs.getEditorDocument(client).paragraphs[to].id
				).catch(err => {
					throw err;
				});

				// Get Editing Document
				const editorDocumentEntity: DocumentEntity = await this.documentModel.findOneByCorpusIDAndOrderWithTexts(
					this.cs.getConnection(client).editorCorpus.id, 
					this.cs.getConnection(client).editorDocumentIndex
				).catch(err => {
					throw err;
				});
				this.cs.getConnection(client).editorCorpus.documents[this.cs.getConnection(client).editorDocumentIndex] = editorDocumentEntity;
				const editorDocument: Document = await editorDocumentEntity.getDocument().catch(err => {
					throw err;
				});

				// Get Explorer Document
				const explorerDocument: Document = await this.getDocumentDiff(
					client, 
					this.cs.getConnection(client).editorDocumentIndex, 
					this.cs.getConnection(client).explorerCorpusIndex, 
					this.cs.getConnection(client).explorerDocumentIndex
				);
				resolve([editorDocument, this.cs.getConnection(client).editorDocumentIndex, explorerDocument, this.cs.getConnection(client).explorerCorpusIndex, this.cs.getConnection(client).explorerDocumentIndex]);
			} catch (err) {
				reject(err);
			}
		});
	}
}
