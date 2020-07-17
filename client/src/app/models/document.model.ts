import { User } from './user.model';
import { Corpus } from './corpus.model';
import { Text } from './text.model';

// export class Document {
// 	// Variables
// 	public author?: User;
// 	public corpus?: Corpus;
// 	public texts?: Text[];

// 	public createdAt?: Date;
// 	public updatedAt?: Date;

// 	// constructor
// 	constructor(author: User = null, corpus: Corpus = null, texts: Text[] = [], createdAt: Date = null, updatedAt: Date = null) {
// 		this.author = author;
// 		this.corpus = corpus;
// 		this.texts = texts;
// 		this.createdAt = createdAt;
// 		this.updatedAt = updatedAt;
// 	}
// }

export class Document {
	// Variables
	public title?: string;
	public description?: string;
	public tableOfContent?: string[];
	public texts?: Text[];

	public createdAt?: Date;
	public updatedAt?: Date;

	// constructor
	constructor(
		title: string = '',
		description: string = '',
		tableOfContent: string[] = [],
		texts: Text[] = [],

		createdAt: Date = null,
		updatedAt: Date = null,
	) {
		this.title = title;
		this.description = description;
		this.tableOfContent = tableOfContent;
		this.texts = texts;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}
