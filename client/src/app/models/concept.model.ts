import { Corpus } from './corpus.model';

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
	constructor(title: string = '', url: string = '', corpora: Corpus[] = [], contributors: number = 0, documents: number = 0, texts: number = 0, createdAt: Date = null, updatedAt: Date = null) {
		this.title = title;
		this.url = url;
		this.corpora = corpora;
		this.nbContributors = contributors;
		this.nbDocuments = documents;
		this.nbTexts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static map(data): Concept {
		let concept: Concept = new Concept();
		if (data.hasOwnProperty('title')) concept.title = data.title;
		if (data.hasOwnProperty('nbContributors')) concept.nbContributors = data.nbContributors;
		if (data.hasOwnProperty('nbDocuments')) concept.nbDocuments = data.nbDocuments;
		if (data.hasOwnProperty('nbTexts')) concept.nbTexts = data.nbTexts;
		if (data.hasOwnProperty('createdAt')) concept.createdAt = data.createdAt;
		if (data.hasOwnProperty('updatedAt')) concept.updatedAt = data.updatedAt;
		if (data.hasOwnProperty('corpora')) concept.corpora = Corpus.maps(data.corpora);
		return concept;
	}

	public static maps(data): Concept[] {
		let concepts: Concept[] = new Array<Concept>(data.length);
		for(let i = 0; i < data.length; i++) {
			concepts[i] = this.map(data[i]);
		}
		return concepts;
	}

	// public static async map(data): Promise<Concept> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			let concept: Concept = new Concept();
	// 			if (data.hasOwnProperty('title')) concept.title = data.title;
	// 			if (data.hasOwnProperty('nbContributors')) concept.nbContributors = data.nbContributors;
	// 			if (data.hasOwnProperty('nbDocuments')) concept.nbDocuments = data.nbDocuments;
	// 			if (data.hasOwnProperty('nbTexts')) concept.nbTexts = data.nbTexts;
	// 			if (data.hasOwnProperty('createdAt')) concept.createdAt = data.createdAt;
	// 			if (data.hasOwnProperty('updatedAt')) concept.updatedAt = data.updatedAt;
	// 			if (data.hasOwnProperty('corpora')) concept.corpora = await Corpus.maps(data.corpora);
	// 			resolve(concept);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// public static async maps(data): Promise<Concept[]> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			let promises = new Array(data.length);
	// 			promises.forEach(async (promise, i) => {
	// 				promise = this.map(data[i]).catch(err => {
	// 					throw err;
	// 				});
	// 			});
	// 			Promise
	// 				.all(promises)
	// 				.then((concepts: Concept[]) => {
	// 					resolve(concepts);
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
