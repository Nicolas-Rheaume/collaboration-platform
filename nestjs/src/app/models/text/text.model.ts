/*****************************************************************************
 *  PARAGRAPH MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { TextEntity } from 'app/entities/text.entity';
import { UserEntity } from 'app/entities/user.entity';
import { DocumentEntity } from 'app/entities/document.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';

@Injectable()
export class TextModel {
	constructor(
		@InjectRepository(TextEntity)
		private textRepository: Repository<TextEntity>,

		@InjectRepository(ParagraphEntity)
		private paragraphRepository: Repository<ParagraphEntity>,
	) {}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async create(text: string, author: UserEntity): Promise<TextEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.textRepository
					.insert({
						text: text,
						tag: '',
						html: '',
						author: author,
						previousText: null,
						depth: 0,
						pointer: 0,
						branches: 0,
					})
					.catch(err => {
						throw 'Error creating the corpus';
					});

				const textEntity = await this.textRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(textEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async createByEntity(entity: TextEntity): Promise<TextEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.textRepository
					.insert({
						text: entity.text,
						depth: entity.depth,
						pointer: entity.pointer,
						branches: entity.branches,
						author: entity.author,
					})
					.catch(err => {
						throw 'Error creating the corpus';
					});

				const textEntity = await this.textRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(textEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async createEmptyByAuthor(author: UserEntity): Promise<TextEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.textRepository
					.insert({
						text: '',
						tag: '',
						html: '',
						author: author,
						previousText: null,
						depth: 0,
						pointer: 0,
						branches: 0,
					})
					.catch(err => {
						throw 'Error creating the corpus';
					});

				const textEntity = await this.textRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(textEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/
	// public async findByDocumentWithoutIDs(document: DocumentEntity, ids: number[]): Promise<TextEntity[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {

	//             const paragraphs = this.paragraphRepository.find({document: document}).catch(err => {
	// 				throw err;
	//             });

	//             const texts = this.textRepository.find().w

	// 			// const paragraphs = await this.paragraphRepository
	// 			// 	.createQueryBuilder('paragraph')
	// 			// 	.leftJoinAndSelect('paragraph.document', 'document')
	// 			// 	.leftJoinAndSelect('paragraph.text', 'text')
	// 			// 	.where('paragraph.document.id = :documentID')
	// 			// 	.orderBy('paragraph.order', 'ASC')
	// 			// 	.setParameters({ documentID: document.id })
	// 			// 	.getMany()
	// 			// 	.catch(err => {
	// 			// 		throw 'Error finding the paragraphs';
	// 			// 	});
	// 			resolve(paragraphs);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

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
	public async updateByID(index: number, text: string): Promise<TextEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.textRepository.update({ id: index }, { text: text }).catch(err => {
					throw 'Error updating the text';
				});

				const textEntity = await this.textRepository.findOne({ id: index }).catch(err => {
					throw 'Error updating the text';
				});

				resolve(textEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	// /*****************************************************************************
	//  *  DELETE
	//  *****************************************************************************/

	// public async deleteByTitle(title: string): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			await this.corpusRepository.delete({ title: title }).catch(err => {
	// 				throw 'Error deleting the user';
	// 			});
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

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
