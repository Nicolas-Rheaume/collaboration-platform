/*****************************************************************************
 *  CORPUS MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like, createQueryBuilder, SelectQueryBuilder } from 'typeorm';

import { Concept, ConceptEntity, ConceptSort, SORTMAP, ConceptSortMap } from 'app/models/concept/concept.entity';
import { UserEntity } from 'app/models/user/user.entity';
import { CorpusModel } from '../corpus/corpus.model';
import { DocumentModel } from '../document/document.model';
import { ParagraphModel } from '../paragraph/paragraph.model';
import { TextModel } from '../text/text.model';
import { UserModel } from '../user/user.model';
import { CorpusEntity, CorpusSort } from '../corpus/corpus.entity';

@Injectable()
export class ConceptModel {
	constructor(
		@InjectRepository(ConceptEntity)
		private conceptRepository: Repository<ConceptEntity>,
		@InjectRepository(CorpusEntity)
		private corpusRepository: Repository<CorpusEntity>,
		private corpusModel: CorpusModel,
		private documentModel: DocumentModel,
		private paragraphModel: ParagraphModel,
		private textModel: TextModel,
		private userModel: UserModel,
	) {
		this.search('', ConceptSort.A_Z, 1, 10, CorpusSort.NEWEST, 2);
	}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async createByTitleAndURL(title: string, url: string): Promise<ConceptEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.conceptRepository
					.insert({
						title: title,
						url: url,
					})
					.catch(err => {
						throw 'Error creating the concept';
					});

				const conceptEntity = await this.conceptRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/
	public async findOneByID(id: number): Promise<ConceptEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const conceptEntity = await this.conceptRepository.findOne({ id: id }).catch(err => {
					throw 'Error finding the concept';
				});
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByTitle(title: string): Promise<ConceptEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				let conceptEntity = await this.conceptRepository.findOne({ title: title }).catch(err => {
					throw 'Error finding the concept';
				});
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByURL(url: string): Promise<ConceptEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const conceptEntity = await this.conceptRepository.findOne({ url: url }).catch(err => {
					throw 'Error finding the concept';
				});
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByURLWithCorpusWithoutUser(url: string, author: UserEntity): Promise<ConceptEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				let conceptEntity = await this.conceptRepository.findOne({ url: url }).catch(err => {
					throw 'Error finding the concept';
				});

				if(conceptEntity != undefined) {
					conceptEntity.corpora = await this.corpusModel.findManyByConceptIDWithoutAuthorID(
						conceptEntity.id,
						author.id
					).catch(err => {
						throw 'Error finding the concept';
					});
				}
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByURLWithCorpusWithoutUserID(url: string, authorID: number): Promise<ConceptEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				let conceptEntity = await this.findOneByURL(url).catch(err => {
					throw 'Error finding the concept';
				});
				const corpusEntities = await this.corpusModel.findManyByConceptIDWithoutAuthorID(conceptEntity.id, authorID).catch(err => {
					throw 'Error finding the concept';
				});
				conceptEntity.corpora = corpusEntities;
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findManyBySearch(search: string, sort: ConceptSort): Promise<ConceptEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let title = '%' + search + '%';
				let corpora: ConceptEntity[] = await this.conceptRepository.find({ title: Like(title) }).catch(err => {
					throw 'Error searching for the corpora';
				});
				corpora.sort(SORTMAP.get(sort));
				resolve(corpora);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  SEARCH
	 *****************************************************************************/
	public async search(search: string, conceptSort: ConceptSort, pageNumber: number, amountOfConcept: number, corpusSort: CorpusSort, amountOfCorpus: number): Promise<ConceptEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let conceptEntities: ConceptEntity[] = await this.conceptRepository
					.find({
						where: { title: Like('%' + search + '%') },
						order: ConceptSortMap.get(conceptSort),
						skip: (pageNumber - 1) * amountOfConcept,
						take: amountOfConcept,
					})
					.catch(err => {
						throw 'Error searching for the concepts';
					});

				let promises = new Array(conceptEntities.length);
				conceptEntities.forEach(async (entity, i) => {
					promises[i] = this.corpusModel.search(entity.id, corpusSort, amountOfCorpus).catch(err => {
						throw err;
					});
				});
				Promise.all(promises)
					.then((values: any) => {
						conceptEntities.forEach((entity, i) => {
							conceptEntities[i].corpora = values[i];
						});
						resolve(conceptEntities);
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
	 *  UPDATE
	 *****************************************************************************/
	public async updateTitle(title: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.conceptRepository.update({ title: title }, { title: title }).catch(err => {
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
	public async deleteByTitle(title: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.conceptRepository.delete({ title: title }).catch(err => {
					throw 'Error deleting the user';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  CHECK
	 *****************************************************************************/
	public async checkTitleDoesntExists(title: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.conceptRepository.count({ where: { title: title } }).catch(err => {
					throw 'Error counting the corpora';
				});
				if (count > 0) throw 'Concept title already exists';
				else resolve(true);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  COUNT
	 *****************************************************************************/
	public async countAll(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.conceptRepository.count().catch(err => {
					throw 'Error counting the concepts';
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
				const title = '%' + search + '%';
				const count = await this.conceptRepository.count({ title: Like(title) }).catch(err => {
					throw 'Error counting the concepts';
				});
				resolve(count);
			} catch (err) {
				reject(err);
			}
		});
	}
}
