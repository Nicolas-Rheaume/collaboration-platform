import { User } from './user.model';
import { Document } from './document.model'

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

export class Corpus {
	// Variables
	public author: User;
	public description?: string;
	public documents?: Document[];

	public contributors?: number;
	public texts?: number;

	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(
		author: User = new User(), 
		description: string = '', 
		documents: Document[] = [], 
		contributors: number = 0,
		texts: number = 0,
		createdAt: Date = null, 
		updatedAt: Date = null
	) {
		this.author = author;
		this.description = description;
		this.documents = documents;
		this.contributors = contributors;
		this.texts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static maps(data): Corpus[] {
		let subjects: Corpus[] = [];

		for (let index = 0; index < data.length; index++) {
			let subject = new Corpus();

			subject.createdAt = data[index].createdAt;
			subject.updatedAt = data[index].updatedAt;
			subject.documents = data[index].documents;
			subject.contributors = data[index].contributors;
			subject.texts = data[index].texts;

			subjects.push(subject);
		}

		return subjects;
	}

	public static map(data): Corpus {
		let subject: Corpus = new Corpus();
		subject.createdAt = data.createdAt;
		subject.updatedAt = data.updatedAt;
		subject.documents = data.documents;
		subject.contributors = data.contributors;
		subject.texts = data.texts;

		return subject;
	}
}
