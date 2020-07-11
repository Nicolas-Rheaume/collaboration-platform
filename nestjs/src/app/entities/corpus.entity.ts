/*****************************************************************************
 *  CORPUS ROLE
 *****************************************************************************/
// export enum CorpusSort {
// 	A_Z = 'A - Z',
// 	Z_A = 'Z - A',
// 	OLDEST = 'Oldest',
// 	NEWEST = 'Newest',
// 	MOST_CONTRIBUTOR = 'Most Contributors',
// 	LEAST_CONTRIBUTOR = 'Least Contributors',
// 	MOST_TEXTS = 'Most Texts',
// 	LEAST_TEXTS = 'Least Texts',
// }

// export const SORTMAP = new Map([
// 	[
// 		CorpusSort.A_Z,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.title > b.title) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.Z_A,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.title < b.title) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.OLDEST,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.createdAt > b.createdAt) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.NEWEST,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.createdAt < b.createdAt) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.MOST_CONTRIBUTOR,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.contributors < b.contributors) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.LEAST_CONTRIBUTOR,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.contributors > b.contributors) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.MOST_TEXTS,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.texts < b.texts) return 1;
// 			else return -1;
// 		},
// 	],
// 	[
// 		CorpusSort.LEAST_TEXTS,
// 		(a: CorpusEntity, b: CorpusEntity) => {
// 			if (a.texts > b.texts) return 1;
// 			else return -1;
// 		},
// 	],
// ]);

/*****************************************************************************
 *  CORPUS TYPE FOR THE CLIENT SIDE
 *****************************************************************************/
export class Corpus {
	// Variables
	public author: User;
	public description: string;
	public documents?: Document[];
	public createdAt?: Date;
	public updatedAt?: Date;

	// constructor
	constructor(
		author: User = null,
		description: string = '',
		documents: Document[] = [],
		createdAt: Date = null, 
		updatedAt: Date = null
	) {
		this.author = author;
		this.description = description;
		this.documents = documents;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// public async getEntity(): Promise<CorpusEntity> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			resolve(
	// 				new CorpusEntity(
	// 					0, 
	// 					this.author.getEntity(), 
	// 					this.concept.getEntity(), 
	// 					this.documents, 
	// 					null, 
	// 					this.texts, 
	// 					this.createdAt, 
	// 					this.updatedAt
	// 					)
	// 				);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async setEntity(corpus: CorpusEntity): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			this.title = corpus.title;
	// 			this.url = corpus.url;
	// 			this.contributors = corpus.contributors;
	// 			this.documents = corpus.documents.length;
	// 			this.texts = corpus.texts;
	// 			this.createdAt = corpus.createdAt;
	// 			this.updatedAt = corpus.updatedAt;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async getJSON(): Promise<any> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			resolve({
	// 				title: this.title,
	// 				url: this.url,
	// 				contributors: this.contributors,
	// 				documents: this.documents,
	// 				texts: this.texts,
	// 				createdAt: this.createdAt,
	// 				updatedAt: this.updatedAt,
	// 			});
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async setJSON(json: any): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			if (json.hasOwnProperty('title')) this.title = json.title;
	// 			if (json.hasOwnProperty('url')) this.url = json.url;
	// 			if (json.hasOwnProperty('contributors')) this.contributors = json.contributors;
	// 			if (json.hasOwnProperty('documents')) this.documents = json.documents;
	// 			if (json.hasOwnProperty('texts')) this.texts = json.texts;
	// 			if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
	// 			if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public static async parseEntities(entities: CorpusEntity[]): Promise<Corpus[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			let promises = new Array(entities.length);
	// 			entities.forEach(async (entity, i) => {
	// 				promises[i] = entity.getCorpus().catch(err => {
	// 					throw err;
	// 				});
	// 			});
	// 			Promise.all(promises)
	// 				.then((values: Corpus[]) => {
	// 					resolve(values);
	// 				})
	// 				.catch(err => {
	// 					throw err;
	// 				});
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}

/*****************************************************************************
 *  CORPUS ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Document, DocumentEntity } from './document.entity';
import { ConceptEntity, Concept } from './concept.entity';
import { UserEntity, User } from './user.entity';

@Entity('corpora')
export class CorpusEntity {
	// Variables
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(
		type => UserEntity,
		user => user.corpora,
	)
	@JoinColumn({ name: 'author' })
	public author: UserEntity;

	@ManyToOne(
		type => ConceptEntity,
		concept => concept.corpora,
	)
	@JoinColumn({ name: 'concept' })
	public concept: ConceptEntity;

	@Column({ type: 'text', default: null})
	public description: string;

	@OneToMany(
		type => DocumentEntity,
		document => document.corpus,
	)
	public documents: DocumentEntity[];

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	// Constructor
	constructor(
		id: number = 0,
		author: UserEntity = null,
		concept: ConceptEntity = null,
		description: string = '',
		documents: DocumentEntity[] = null,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date(),
	) {
		this.id = id;
		this.author = author;
		this.concept = concept;
		this.description = description;
		this.documents = documents;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public async getCorpus(): Promise<Corpus> {
		return new Promise(async (resolve, reject) => {
			try {
				let documents = [];

				if(this.documents != undefined && this.documents != null) {
					documents = await DocumentEntity.getDocuments(this.documents).catch(err => {
						throw err;
					});
				}
				
				resolve(
					new Corpus(
						await this.author.getUser(), 
						this.description,
						documents, 
						this.createdAt, 
						this.updatedAt
					)
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async getCorpora(entities: CorpusEntity[]): Promise<Corpus[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpora = new Array(entities.length);
				for(let i = 0; i < entities.length; i++) {
					corpora[i] = entities[i].getCorpus();
				}
				Promise.all(corpora).then(values => {
					resolve(values);
				})
			} catch (err) {
				reject(err);
			}
		});
	}

	// public async setCorpus(corpus: Corpus): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			this.id = 0;
	// 			this.title = corpus.title;
	// 			this.url = corpus.url;
	// 			this.contributors = corpus.contributors;
	// 			this.texts = corpus.texts;
	// 			this.createdAt = corpus.createdAt;
	// 			this.updatedAt = corpus.updatedAt;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async getJSON(): Promise<any> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			resolve({
	// 				id: this.id,
	// 				title: this.title,
	// 				url: this.url,
	// 				contributors: this.contributors,
	// 				documents: this.documents,
	// 				texts: this.texts,
	// 				createdAt: this.createdAt,
	// 				updatedAt: this.updatedAt,
	// 			});
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public async setJSON(json: any): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			if (json.hasOwnProperty('id')) this.id = json.id;
	// 			if (json.hasOwnProperty('title')) this.title = json.title;
	// 			if (json.hasOwnProperty('url')) this.url = json.url;
	// 			if (json.hasOwnProperty('contributors')) this.contributors = json.contributors;
	// 			if (json.hasOwnProperty('documents')) this.documents = json.documents;
	// 			if (json.hasOwnProperty('texts')) this.texts = json.texts;
	// 			if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
	// 			if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
	// 			resolve();
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}
