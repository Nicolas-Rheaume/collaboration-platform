/*****************************************************************************
 *  CORPUS MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { Corpus, CorpusEntity, CorpusSort, CorpusSortMap } from 'app/models/corpus/corpus.entity';
import { ConceptEntity } from 'app/models/concept/concept.entity';
import { UserEntity } from 'app/models/user/user.entity';
import { DocumentEntity } from 'app/models/document/document.entity';
import { DocumentModel } from 'app/models/document/document.model';
import { ConceptModel } from '../concept/concept.model';
import { UserModel } from '../user/user.model';
import { TextModel } from '../text/text.model';
import { ParagraphModel } from '../paragraph/paragraph.model';
import { Query } from 'typeorm/driver/Query';

@Injectable()
export class CorpusModel {
	constructor(
		@InjectRepository(CorpusEntity)
		private corpusRepository: Repository<CorpusEntity>,
		private documentModel: DocumentModel,
		private paragraphModel: ParagraphModel,
		private textModel: TextModel,
		private userModel: UserModel,
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

	public async createByConceptAndAuthorID(concept: ConceptEntity, authorID: number): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const author = await this.userModel.findOneByID(authorID).catch(err => {
					throw err;
				});
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
				const corpusEntity = await this.corpusRepository.findOne({ author: author, concept: concept }).catch(err => {
					throw 'Error finding the corpus';
				});
				if (corpusEntity != undefined) resolve(corpusEntity);
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
	 *  COPY
	 *****************************************************************************/

	public async copyOneByIDToAuthor(corpusID: number, authorID: number): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const oldCorpus = await this.corpusRepository
					.createQueryBuilder('corpus')
					.innerJoinAndSelect('corpus.author', 'author')
					.innerJoinAndSelect('corpus.concept', 'concept')
					.innerJoinAndSelect('corpus.documents', 'documents')
					.where('corpus.id = ' + corpusID)
					.getOne()
					.catch(err => {
						throw 'Error finding the corpus';
					});

				const data = await this.corpusRepository
					.insert({
						description: oldCorpus.description,
						author: oldCorpus.author,
						concept: oldCorpus.concept,
					})
					.catch(err => {
						throw 'error creating the corpus';
					});

				let newCorpus = await this.corpusRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});

				newCorpus.documents = await this.documentModel.copyManyToCorpus(oldCorpus.documents, newCorpus).catch(err => {
					throw err;
				});

				resolve(newCorpus);
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

				if (corpusEntity === undefined) resolve(undefined);
				else {
					const documentEntities = await this.documentModel.findDocumentsByCorpusID(corpusEntity.id).catch(err => {
						throw "Error finding the corpus' documents";
					});
					corpusEntity.documents = documentEntities;
					resolve(corpusEntity);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByIDWithText(corpusID: number): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpusEntity = await this.corpusRepository
					.createQueryBuilder('corpus')
					.innerJoinAndSelect('corpus.author', 'author')
					.innerJoinAndSelect('corpus.documents', 'documents')
					.innerJoinAndSelect('documents.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('corpus.id = ' + corpusID)
					.getOne()
					.catch(err => {
						throw 'Error finding the corpus';
					});
				resolve(corpusEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findManyByConceptIDWithoutAuthorID(conceptID: number, authorID: number): Promise<CorpusEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpusEntities = await this.corpusRepository
					.createQueryBuilder('corpus')
					.innerJoinAndSelect('corpus.author', 'author')
					.where('corpus.concept = ' + conceptID)
					.andWhere('corpus.author != ' + authorID)
					.getMany()
					.catch(err => {
						throw 'Error finding the corpus';
					});
				if (corpusEntities === undefined) resolve([]);
				else {
					let promises = new Array(corpusEntities.length);
					for(let i = 0; i < promises.length; i++) {
						promises[i] = this.documentModel.findDocumentsByCorpusID(
							corpusEntities[i].id,
						).catch(err => {
							throw err;
						});
					}
					Promise.all(promises).then((data) => {
						corpusEntities.forEach((corpus, i) => {
							corpus.documents = data[i];
						});
						resolve(corpusEntities);
					}).catch(err => {
						throw err;
					});
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findManyByDescription(description: string): Promise<CorpusEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const search = '%' + description + '%';
				const corpusEntities = await this.corpusRepository
					.createQueryBuilder('corpus')
					.innerJoinAndSelect('corpus.author', 'author')
					.where('corpus.description = ' + search)
					.getMany()
					.catch(err => {
						throw 'Error finding the corpus';
					});

				if (corpusEntities === undefined) resolve([]);
				else resolve(corpusEntities);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  SEARCH
	 *****************************************************************************/
	public async search(conceptID: number, corpusSort: CorpusSort, amountOfCorpus: number): Promise<CorpusEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const corpusEntities: CorpusEntity[] = await this.corpusRepository
					.find({
						where: { concept: conceptID },
						order: CorpusSortMap.get(corpusSort),
						take: amountOfCorpus,
					})
					.catch(err => {
						throw 'Error searching for the concepts';
					});
				if (corpusEntities === undefined) resolve([]);
				else resolve(corpusEntities);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  UPDATE
	 *****************************************************************************/
	public async updateDescriptionByID(corpusID: number, description: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.corpusRepository.update({ id: corpusID }, { description: description }).catch(err => {
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
	public async deleteByConceptAndAuthorID(conceptID: number, authorID: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.corpusRepository
					.createQueryBuilder('corpus')
					.where(`corpus.author = ${authorID}`)
					.andWhere(`corpus.concept = ${conceptID}`)
					.delete();
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

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

	/*****************************************************************************
	 *  COUNT
	 *****************************************************************************/
	public async countAll(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.corpusRepository.count().catch(err => {
					throw 'Error counting the corpora';
				});
				resolve(count);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async countBySearch(search: string): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const description = '%' + search + '%';
				const count = await this.corpusRepository.count({ description: Like(description) }).catch(err => {
					throw 'Error counting the corpora';
				});
				resolve(count);
			} catch (err) {
				reject(err);
			}
		});
	}
}
