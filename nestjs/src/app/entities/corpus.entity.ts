/*****************************************************************************
 *  CORPUS ROLE
 *****************************************************************************/
export enum CorpusSort {
	A_Z = 'A - Z',
	Z_A = 'Z - A',
	OLDEST = 'Oldest',
	NEWEST = 'Newest',
	MOST_CONTRIBUTOR = 'Most Contributors',
	LEAST_CONTRIBUTOR = 'Least Contributors',
	MOST_TEXTS = 'Most Texts',
	LEAST_TEXTS = 'Least Texts',
}

export const SORTMAP = new Map([
	[
		CorpusSort.A_Z,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.title > b.title) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.Z_A,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.title < b.title) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.OLDEST,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.createdAt > b.createdAt) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.NEWEST,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.createdAt < b.createdAt) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.MOST_CONTRIBUTOR,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.contributors < b.contributors) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.LEAST_CONTRIBUTOR,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.contributors > b.contributors) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.MOST_TEXTS,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.texts < b.texts) return 1;
			else return -1;
		},
	],
	[
		CorpusSort.LEAST_TEXTS,
		(a: CorpusEntity, b: CorpusEntity) => {
			if (a.texts > b.texts) return 1;
			else return -1;
		},
	],
]);

/*****************************************************************************
 *  CORPUS TYPE FOR THE CLIENT SIDE
 *****************************************************************************/
export class Corpus {
	// Variables
	public title?: string;
	public url?: string;

	public contributors?: number;
	public texts?: number;

	public createdAt?: Date;
	public updatedAt?: Date;

	// constructor
	constructor(title: string = '', url: string = '', contributors: number = 0, texts: number = 0, createdAt: Date = null, updatedAt: Date = null) {
		this.title = title;
		this.url = url;
		this.contributors = contributors;
		this.texts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public async getEntity(): Promise<CorpusEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(new CorpusEntity(0, this.title, this.url, this.contributors, this.texts, this.createdAt, this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setEntity(corpus: CorpusEntity): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.title = corpus.title;
				this.url = corpus.url;
				this.contributors = corpus.contributors;
				this.texts = corpus.texts;
				this.createdAt = corpus.createdAt;
				this.updatedAt = corpus.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getJSON(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve({
					title: this.title,
					url: this.url,
					contributors: this.contributors,
					texts: this.texts,
					createdAt: this.createdAt,
					updatedAt: this.updatedAt,
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setJSON(json: any): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				if (json.hasOwnProperty('title')) this.title = json.title;
				if (json.hasOwnProperty('url')) this.url = json.url;
				if (json.hasOwnProperty('contributors')) this.contributors = json.contributors;
				if (json.hasOwnProperty('texts')) this.texts = json.texts;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async parseEntities(entities: CorpusEntity[]): Promise<Corpus[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(entities.length);
				entities.forEach(async (entity, i) => {
					promises[i] = entity.getCorpus().catch(err => {
						throw err;
					});
				});
				Promise.all(promises)
					.then((values: Corpus[]) => {
						resolve(values);
					})
					.catch(err => {
						throw err;
					});
			} catch (err) {
				reject(err);
			}
		});
	}
}

/*****************************************************************************
 *  CORPUS ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('corpora')
export class CorpusEntity {
	// Variables
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', width: 255 })
	public title: string;

	@Column({ type: 'varchar', width: 255 })
	public url: string;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	public contributors?: number;
	public texts?: number;

	// Constructor
	constructor(id: number = 0, title: string = '', url: string = '', contributors: number = 0, texts: number = 0, createdAt: Date = null, updatedAt: Date = null) {
		this.id = id;
		this.title = title;
		this.url = url;
		this.contributors = contributors;
		this.texts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public async getCorpus(): Promise<Corpus> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(new Corpus(this.title, this.url, this.contributors, this.texts, this.createdAt, this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setCorpus(corpus: Corpus): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.id = 0;
				this.title = corpus.title;
				this.url = corpus.url;
				this.contributors = corpus.contributors;
				this.texts = corpus.texts;
				this.createdAt = corpus.createdAt;
				this.updatedAt = corpus.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getJSON(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve({
					id: this.id,
					title: this.title,
					url: this.url,
					contributors: this.contributors,
					texts: this.texts,
					createdAt: this.createdAt,
					updatedAt: this.updatedAt,
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setJSON(json: any): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				if (json.hasOwnProperty('id')) this.id = json.id;
				if (json.hasOwnProperty('title')) this.title = json.title;
				if (json.hasOwnProperty('url')) this.url = json.url;
				if (json.hasOwnProperty('contributors')) this.contributors = json.contributors;
				if (json.hasOwnProperty('texts')) this.texts = json.texts;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
}
