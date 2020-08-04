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

	public static map(data): Document {
		let document: Document = new Document();
		if (data.hasOwnProperty('title')) document.title = data.title;
		if (data.hasOwnProperty('description')) document.description = data.description;
		if (data.hasOwnProperty('tableOfContent')) document.tableOfContent = data.tableOfContent;
		if (data.hasOwnProperty('texts')) document.texts = Text.maps(data.texts);
		if (data.hasOwnProperty('createdAt')) document.createdAt = data.createdAt;
		if (data.hasOwnProperty('updatedAt')) document.updatedAt = data.updatedAt;
		return document;
	}

	public static maps(data): Document[] {
		let documents: Document[] = new Array<Document>(data.length);
		for(let i = 0; i < data.length; i++) {
			documents[i] = this.map(data[i]);
		}
		return documents;
	}
}
