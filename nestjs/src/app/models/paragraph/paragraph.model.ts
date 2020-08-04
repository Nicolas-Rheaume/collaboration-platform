/*****************************************************************************
 *  PARAGRAPH MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { ParagraphEntity } from 'app/models/paragraph/paragraph.entity';
import { DocumentEntity } from 'app/models/document/document.entity';
import { TextEntity } from 'app/models/text/text.entity';
import { TextModel } from '../text/text.model';

@Injectable()
export class ParagraphModel {
	constructor(
		@InjectRepository(ParagraphEntity)
		private paragraphRepository: Repository<ParagraphEntity>,
		private textModel: TextModel,
	) {}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async create(document: DocumentEntity, text: TextEntity, order: number): Promise<ParagraphEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.paragraphRepository
					.insert({
						document: document,
						text: text,
						order: order,
					})
					.catch(err => {
						throw 'Error creating the corpus';
					});

				const paragraphEntity = await this.paragraphRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(paragraphEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  COPY
	 *****************************************************************************/

	public async copyOneToDocument(paragraph: ParagraphEntity, document: DocumentEntity): Promise<ParagraphEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.paragraphRepository
					.insert({
						document: document,
						text: paragraph.text,
						order: paragraph.order,
					})
					.catch(err => {
						throw 'error creating the document';
					});
				const paragraphEntity = await this.paragraphRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(paragraphEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyOneByIDToDocument(paragraphID: number, document: DocumentEntity): Promise<ParagraphEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const paragraph = await this.paragraphRepository
					.createQueryBuilder('paragraph')
					.innerJoinAndSelect('paragraph.document', 'document')
					.innerJoinAndSelect('paragraph.text', 'text')
					.where('paragraph.id = ' + paragraphID)
					.getOne()
					.catch(err => {
						throw 'Error finding the paragraph';
					});

				const data = await this.paragraphRepository
					.insert({
						document: document,
						text: paragraph.text,
						order: paragraph.order,
					})
					.catch(err => {
						throw 'error creating the paragraph';
					});
				const paragraphEntity = await this.paragraphRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(paragraphEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyManyToDocument(paragraphs: ParagraphEntity[], document: DocumentEntity): Promise<ParagraphEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(paragraphs.length);
				paragraphs.forEach(async (paragraph, i) => {
					promises[i] = this.copyOneByIDToDocument(paragraph.id, document).catch(err => {
						throw err;
					});
				});
				Promise.all(promises)
					.then((paragraphEntities: ParagraphEntity[]) => {
						resolve(paragraphEntities);
					})
					.catch(err => {
						throw err;
					});
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyManyFromDocumentToDocument(fromDocument: DocumentEntity, toDocument: DocumentEntity): Promise<ParagraphEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {

				// Get all paragraphs
				const paragraphs = await this.paragraphRepository
					.createQueryBuilder('paragraph')
					.innerJoinAndSelect('paragraph.document', 'document')
					.innerJoinAndSelect('paragraph.text', 'text')
					.where('document = ' + fromDocument.id)
					.getMany()
					.catch(err => {
						throw 'Error finding the paragraph';
					});

				// Create the paragraphs
				let promises = new Array(paragraphs.length);
				paragraphs.forEach(async (paragraph, i) => {
					promises[i] = this.create(toDocument, paragraph.text, paragraph.order).catch(err => {
						throw err;
					});
				});
				Promise.all(promises)
					.then((paragraphEntities: ParagraphEntity[]) => {
						console.log(paragraphEntities);
						resolve(paragraphEntities);
					})
					.catch(err => {
						throw err;
					});
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/
	public async findByDocumentWithText(document: DocumentEntity): Promise<ParagraphEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const paragraphs = await this.paragraphRepository
					.createQueryBuilder('paragraph')
					.leftJoinAndSelect('paragraph.document', 'document')
					.leftJoinAndSelect('paragraph.text', 'text')
					.where('paragraph.document.id = :documentID')
					.orderBy('paragraph.order', 'ASC')
					.setParameters({ documentID: document.id })
					.getMany()
					.catch(err => {
						throw 'Error finding the paragraphs';
					});
				resolve(paragraphs);
			} catch (err) {
				reject(err);
			}
		});
	}

	// public async findOneByTitle(title: string): Promise<CorpusEntity> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const corpusEntity = await this.corpusRepository.findOne({ title: title }).catch(err => {
	// 				throw 'Error finding the corpus';
	// 			});
	// 			resolve(corpusEntity);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async findAll(search: string, sort: CorpusSort): Promise<CorpusEntity[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			let corpora: CorpusEntity[] = await this.corpusRepository.find().catch(err => {
	// 				throw 'Error searching for the corpora';
	// 			});
	// 			resolve(corpora);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async findBySearch(search: string, sort: CorpusSort): Promise<CorpusEntity[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			let title = '%' + search + '%';
	// 			let corpora: CorpusEntity[] = await this.corpusRepository.find({ title: Like(title) }).catch(err => {
	// 				throw 'Error searching for the corpora';
	// 			});
	// 			corpora.sort(SORTMAP.get(sort));
	// 			resolve(corpora);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	/*****************************************************************************
	 *  UPDATE
	 *****************************************************************************/
	public async updateOrderByID(id: number, order: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.paragraphRepository.update({ id: id }, { order: order }).catch(err => {
					throw 'Error updating the paragraph';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async updateText(id: number, text: TextEntity): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.paragraphRepository.update({ id: id }, { text: text }).catch(err => {
					throw 'Error updating the paragraph';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async updateOrdersAtIndex(paragraphs: ParagraphEntity[], index: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(paragraphs.length);
				paragraphs.forEach(async (paragraph, i) => {
					promises[i] = await this.paragraphRepository.update({ id: paragraph.id }, { order: index + i }).catch(err => {
						throw 'Error updating the order of the paragraph';
					});
				});
				Promise.all(promises)
					.then(() => {
						resolve();
					})
					.catch(err => {
						throw err;
					});
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  DELETE
	 *****************************************************************************/

	public async deleteByID(id: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.paragraphRepository.delete({ id: id }).catch(err => {
					throw 'Error deleting the paragraph';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async deleteAllByDocument(documentEntity: DocumentEntity): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.paragraphRepository.delete({ document: documentEntity }).catch(err => {
					throw 'Error deleting the paragraphs';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	// /*****************************************************************************
	//  *  CHECK
	//  *****************************************************************************/
	// public async checkTitleDoesntExists(title: string): Promise<boolean> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const count = await this.corpusRepository.count({ where: { title: title } }).catch(err => {
	// 				throw 'Error counting the corpora';
	// 			});
	// 			if (count > 0) throw 'Corpus title already exists';
	// 			else resolve(true);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}
