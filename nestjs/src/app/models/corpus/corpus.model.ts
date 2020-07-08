/*****************************************************************************
 *  CORPUS MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { Corpus, CorpusEntity } from 'app/entities/corpus.entity';
import { ConceptEntity } from 'app/entities/concept.entity';
import { UserEntity } from 'app/entities/user.entity';

@Injectable()
export class CorpusModel {
	constructor(
		@InjectRepository(CorpusEntity)
		private corpusRepository: Repository<CorpusEntity>,
	) {}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async createByConceptAndAuthor(concept: ConceptEntity, author: UserEntity): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.corpusRepository
					.insert({
						concept: concept,
						author: author,
					})
					.catch(err => {
						throw 'Error creating the corpus';
					});

				const corpusEntity = await this.corpusRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(corpusEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/
	public async findOneByID(id: number): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const corpusEntity = await this.corpusRepository.findOne({ id: id }).catch(err => {
					throw 'Error finding the corpus';
				});
				resolve(corpusEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByConceptAndAuthor(concept: ConceptEntity, author: UserEntity): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpusEntity = await this.corpusRepository.findOne({ concept: concept, author: author }).catch(err => {
					throw 'Error finding the corpus';
				});
				resolve(corpusEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	// public async findOneByURL(url: string): Promise<CorpusEntity> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const corpusEntity = await this.corpusRepository
	// 				.findOne({ url: url })
	// 				.catch(err => {
	// 					throw 'Error finding the corpus';
	// 				});
	// 			resolve(corpusEntity);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async findAll(search: string, sort: CorpusSort): Promise<CorpusEntity[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const corpora: CorpusEntity[] = await this.corpusRepository.find().catch(err => {
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
	// public async updateTitle(title: string): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			await this.corpusRepository.update({ title: title }, { title: title }).catch(err => {
	// 				throw 'Error updating the user';
	// 			});
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	/*****************************************************************************
	 *  DELETE
	 *****************************************************************************/

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

	/*****************************************************************************
	 *  CHECK
	 *****************************************************************************/
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
