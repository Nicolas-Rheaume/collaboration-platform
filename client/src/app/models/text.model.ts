export class Text {
	// Variables
	public text?: string;

	public createdAt?: Date;
	public updatedAt?: Date;

	constructor(text: string = '', createdAt: Date = new Date(), updatedAt: Date = new Date()) {
		this.text = text;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

// export class Text {
// 	id?: number;
// 	text?: string;
// 	author?: string;
// 	disabled?: boolean;
// 	popularity?: number;
// 	branches?: number;
// 	previous?: number;
// 	views?: number;
// 	likes?: number;
// 	dislikes?: number;
// 	showDetailed?: boolean;
// 	createdAt?: Date;
// 	updatedAt?: Date;

// 	constructor(
// 		id: number = 0,
// 		text: string = '',
// 		author: string = '',
// 		disabled: boolean = true,
// 		popularity: number = 0,
// 		branches: number = 0,
// 		previous: number = 0,
// 		views: number = 0,
// 		likes: number = 0,
// 		dislikes: number = 0,
// 		showDetailed: boolean = false,
// 		createdAt: Date = new Date(),
// 		updatedAt: Date = new Date(),
// 	) {
// 		this.id = id;
// 		this.text = text;
// 		this.author = author;
// 		this.disabled = disabled;
// 		this.popularity = popularity;
// 		this.branches = branches;
// 		this.previous = previous;
// 		this.views = views;
// 		this.likes = likes;
// 		this.dislikes = dislikes;
// 		this.showDetailed = showDetailed;
// 		this.createdAt = createdAt;
// 		this.updatedAt = updatedAt;
// 	}

// 	public static map(data): Text {
// 		let text: Text = new Text();

// 		text.id = data.id;
// 		text.text = data.text;
// 		text.author = data.author;
// 		text.disabled = data.disabled;
// 		text.popularity = data.popularity;
// 		text.branches = data.branches;
// 		text.previous = data.previous;
// 		text.views = data.views;
// 		text.likes = data.likes;
// 		text.dislikes = data.dislikes;
// 		text.createdAt = data.createdAt;
// 		text.updatedAt = data.updatedAt;

// 		return text;
// 	}

// 	public static maps(data): Text[] {
// 		let texts: Text[] = [];

// 		for (let index = 0; index < data.length; index++) {
// 			let t = new Text();

// 			t.id = data[index].id;
// 			t.text = data[index].text;
// 			t.author = data[index].author;
// 			t.disabled = data[index].disabled;
// 			t.popularity = data[index].popularity;
// 			t.branches = data[index].branches;
// 			t.previous = data[index].previous;
// 			t.views = data[index].views;
// 			t.likes = data[index].likes;
// 			t.dislikes = data[index].dislikes;
// 			t.createdAt = data[index].createdAt;
// 			t.updatedAt = data[index].updatedAt;

// 			texts.push(t);
// 		}
// 		return texts;
// 	}
// }
