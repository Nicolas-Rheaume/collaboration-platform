/*****************************************************************************
 *  PARAGRAPH MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { DocumentEntity } from 'app/entities/document.entity';
import { TextEntity } from 'app/entities/text.entity';

@Injectable()
export class ParagraphModel {
	constructor(
		@InjectRepository(ParagraphEntity)
		private paragraphRepository: Repository<ParagraphEntity>,
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
					throw 'Error updating the user';
				});
				resolve();
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
					throw 'Error deleting the user';
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
