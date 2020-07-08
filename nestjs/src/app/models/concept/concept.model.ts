/*****************************************************************************
 *  CORPUS MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository, Like } from 'typeorm';
import { Concept, ConceptEntity, ConceptSort, SORTMAP } from 'app/entities/concept.entity';

@Injectable()
export class ConceptModel {
	constructor(
		@InjectRepository(ConceptEntity)
		private conceptRepository: Repository<ConceptEntity>,
	) {}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async create(title: string, url: string): Promise<ConceptEntity> {
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
				const conceptEntity = await this.conceptRepository
					.findOne({ url: url })
					.catch(err => {
						throw 'Error finding the concept';
					});
				resolve(conceptEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findAll(search: string, sort: ConceptSort): Promise<ConceptEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpora: ConceptEntity[] = await this.conceptRepository.find().catch(err => {
					throw 'Error searching for the corpora';
				});
				resolve(corpora);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findBySearch(search: string, sort: ConceptSort): Promise<ConceptEntity[]> {
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
}
