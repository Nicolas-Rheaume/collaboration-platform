/*****************************************************************************
 *  CORPUS MODEL
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { Corpus, CorpusEntity, CorpusSort, SORTMAP } from 'app/entities/corpus.entity';

@Injectable()
export class CorpusModel {
	constructor(
		@InjectRepository(CorpusEntity)
		private corpusRepository: Repository<CorpusEntity>,
	) {}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async create(title: string, url: string): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.corpusRepository
					.insert({
						title: title,
						url: url,
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

	public async findAll(search: string, sort: CorpusSort): Promise<CorpusEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let title = '%' + search + '%';
				let corpora: CorpusEntity[] = await this.corpusRepository.find({ title: title }).catch(err => {
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
				await this.corpusRepository.update({ title: title }, { title: title }).catch(err => {
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
				await this.corpusRepository.delete({ title: title }).catch(err => {
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
				const count = await this.corpusRepository.count({ where: { title: title } }).catch(err => {
					throw 'Error counting the corpora';
				});
				if (count > 0) throw 'Corpus title already exists';
				else resolve(true);
			} catch (err) {
				reject(err);
			}
		});
	}
}
