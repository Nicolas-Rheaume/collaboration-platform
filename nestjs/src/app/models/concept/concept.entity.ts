/*****************************************************************************
 *  CONCEPT ROLE
 *****************************************************************************/
export enum ConceptSort {
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
		ConceptSort.A_Z,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.title > b.title) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.Z_A,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.title < b.title) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.OLDEST,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.createdAt > b.createdAt) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.NEWEST,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.createdAt < b.createdAt) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.MOST_CONTRIBUTOR,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.nbContributors < b.nbContributors) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.LEAST_CONTRIBUTOR,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.nbContributors > b.nbContributors) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.MOST_TEXTS,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.nbTexts < b.nbTexts) return 1;
			else return -1;
		},
	],
	[
		ConceptSort.LEAST_TEXTS,
		(a: ConceptEntity, b: ConceptEntity) => {
			if (a.nbTexts > b.nbTexts) return 1;
			else return -1;
		},
	],
]);

export const ConceptSortMap = new Map()
	.set(ConceptSort.A_Z, 				{ title: "ASC"})
	.set(ConceptSort.Z_A, 				{ title: "DESC"})
	.set(ConceptSort.OLDEST, 			{ createdAt: "ASC"})
	.set(ConceptSort.NEWEST, 			{ createdAt: "DESC"})
	.set(ConceptSort.MOST_CONTRIBUTOR, 	{ nbContributors: "DESC"})
	.set(ConceptSort.LEAST_CONTRIBUTOR, { nbContributors: "ASC"})
	.set(ConceptSort.MOST_TEXTS, 		{ texts: "DESC"})
	.set(ConceptSort.LEAST_TEXTS, 		{ texts: "ASC"});

/*****************************************************************************
 *  CONCEPT TYPE FOR THE CLIENT SIDE
 *****************************************************************************/
export class Concept {
    
	// Variables
	public title: string;
    public url: string;
    public createdAt: Date;
    public updatedAt: Date;
    
    public corpora?: Corpus[];

	public nbContributors?: number;
	public nbDocuments?: number;
	public nbTexts?: number;

	// constructor
	constructor(
        title: string = '', 
        url: string = '', 
        contributors: number = 0, 
        documents: number = 0, 
        texts: number = 0, 
        createdAt: Date = null, 
        updatedAt: Date = null
    ) {
		this.title = title;
        this.url = url;
		this.nbContributors = contributors;
		this.nbDocuments = documents;
		this.nbTexts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

/*****************************************************************************
 *  CONCEPT ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Corpus, CorpusEntity } from '../corpus/corpus.entity';

@Entity('concepts')
export class ConceptEntity {
	// Variables
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', width: 255 })
	public title: string;

	@Column({ type: 'varchar', width: 255 })
	public url: string;

	@OneToMany(
		type => CorpusEntity,
		corpus => corpus.concept,
	)
	public corpora?: CorpusEntity[];

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

    public nbContributors?: number;
    public nbDocuments?: number;
	public nbTexts?: number;

	// Constructor
	constructor(
		id: number = 0,
		title: string = '',
        url: string = '',
        createdAt: Date = new Date(),
		updatedAt: Date = new Date(),
        
        corpora: CorpusEntity[] = [],

		nbContributors: number = 0,
		nbDocuments: number = 0,
		nbTexts: number = 0,

	) {
		this.id = id;
		this.title = title;
        this.url = url;
        this.createdAt = createdAt;
		this.updatedAt = updatedAt;

		//this.corpora = corpora;
        
		this.nbContributors = nbContributors;
		this.nbDocuments = nbDocuments;
		this.nbTexts = nbTexts;
	}

	public async getConcept(): Promise<Concept> {
		return new Promise(async (resolve, reject) => {
			try {
				let corpora = [];
				if(this.corpora != undefined && this.corpora != null) {
					corpora = await CorpusEntity.getCorpora(this.corpora).catch(err => {
						throw err;
					});
				}
				let concept = new Concept(
					this.title, 
					this.url,
					this.nbContributors, 
					this.nbDocuments, 
					this.nbTexts, 
					this.createdAt, 
					this.updatedAt
				);
				concept.corpora = corpora;
				resolve(concept);
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async getConcepts(entities: ConceptEntity[]): Promise<Concept[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(entities.length);
				entities.forEach(async (entity, i) => {
					promises[i] = entity.getConcept().catch(err => {
						throw err;
					});
				});
				Promise.all(promises)
					.then((values: Concept[]) => {
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

	public async setConcept(concept: Concept): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.id = 0;
				this.title = concept.title;
                this.url = concept.url;
                this.nbContributors = concept.nbContributors;
				this.nbDocuments = concept.nbDocuments;
				this.nbTexts = concept.nbTexts;
				this.createdAt = concept.createdAt;
				this.updatedAt = concept.updatedAt;
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
					nbContributors: this.nbContributors,
					nbDocuments: this.nbDocuments,
					nbTexts: this.nbTexts,
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
				if (json.hasOwnProperty('nbContributors')) this.nbContributors = json.nbContributors;
				if (json.hasOwnProperty('nbDocuments')) this.nbDocuments = json.nbDocuments;
				if (json.hasOwnProperty('nbTexts')) this.nbTexts = json.nbTexts;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
}
