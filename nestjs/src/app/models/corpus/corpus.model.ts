/*****************************************************************************
 *  CORPUS MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { Corpus, CorpusEntity } from 'app/entities/corpus.entity';
import { ConceptEntity } from 'app/entities/concept.entity';
import { UserEntity } from 'app/entities/user.entity';
import { DocumentEntity } from 'app/entities/document.entity';
import { DocumentModel } from 'app/models/document/document.model'

@Injectable()
export class CorpusModel {
	constructor(
		@InjectRepository(CorpusEntity)
		private corpusRepository: Repository<CorpusEntity>,
		private documentModel: DocumentModel,
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

	public async UpsertByAuthorAndConcept(author: UserEntity, concept: ConceptEntity): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const corpusEntity = await this.corpusRepository.findOne({author: author, concept: concept}).catch(err => {
					throw 'Error finding the corpus';
				});
				if(corpusEntity != undefined) resolve(corpusEntity);
				else {
					const data = await this.corpusRepository
						.insert({
							concept: concept,
							author: author,
						})
						.catch(err => {
							throw err;
						});
					const newCorpusEntity = await this.corpusRepository.findOne(data.raw.insertId).catch(err => {
						throw err;
					});
					resolve(newCorpusEntity);
				}
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

	public async findOneByConceptAndAuthorID(conceptID: number, authorID: number): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpusEntity = await this.corpusRepository
					.createQueryBuilder('corpus')
					.innerJoinAndSelect('corpus.author', 'author')
					.where('corpus.concept = ' + conceptID)
					.andWhere('corpus.author = ' + authorID)
					.getOne()
					.catch(err => {
						throw 'Error finding the corpus';
					});

				const documentEntities = await this.documentModel
					.findDocumentsByCorpusID(corpusEntity.id)
					.catch(err => {
						throw "Error finding the corpus' documents";
					});
				corpusEntity.documents = documentEntities;
				console.log(corpusEntity);
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
	 public async updateDescriptionByID(corpusID: number, description: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.corpusRepository.update(
					{ id: corpusID }, 
					{ description: description }
				).catch(err => {
					throw 'Error updating the user';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
	
	
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
