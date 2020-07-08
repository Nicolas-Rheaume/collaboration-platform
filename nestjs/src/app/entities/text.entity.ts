/*****************************************************************************
 *  TEXT TYPE FOR THE CLIENT SIDE
 *****************************************************************************/

export class Text {
	// Variables
	public text?: string;
	public tag?: string;
	public html?: string;

	public createdAt?: Date;
	public updatedAt?: Date;

	// constructor

	constructor(
		text: string = '', 
		tag: string = '', 
		html: string = '', 
		createdAt: Date = new Date(), 
		updatedAt: Date = new Date()
	) {
		this.text = text;
		this.tag = tag;
		this.html = html;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public async getEntity(): Promise<TextEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(
					new TextEntity(
						0, 
						this.text, 
						this.tag, 
						this.html, 
						null, 
						null, 
						0, 
						0, 
						0, 
						this.createdAt,
						this.updatedAt
						));
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setEntity(textEntity: TextEntity): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.text = textEntity.text;
				this.tag = textEntity.tag;
				this.html = textEntity.html;
				this.createdAt = textEntity.createdAt;
				this.updatedAt = textEntity.updatedAt;
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
					text: this.text,
					tag: this.tag,
					html: this.html,
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
				if (json.hasOwnProperty('text')) this.text = json.text;
				if (json.hasOwnProperty('tag')) this.tag = json.tag;
				if (json.hasOwnProperty('html')) this.html = json.html;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async parseEntities(entities: TextEntity[]): Promise<Text[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(entities.length);
				entities.forEach(async (entity, i) => {
					promises[i] = entity.getText().catch(err => {
						throw err;
					});
				});
				Promise.all(promises)
					.then((values: Text[]) => {
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
 *  TEXT ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { User, UserEntity } from './user.entity';
import { ParagraphEntity } from './paragraph.entity';

@Entity('texts')
export class TextEntity {
	// Variables
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'text' })
	public text: string;

	@Column({ type: 'text' })
	public tag: string;

	@Column({ type: 'text' })
	public html: string;

	@ManyToOne(
		type => UserEntity,
		user => user.texts,
	)
	@JoinColumn({ name: 'author' })
	public author: UserEntity;

	@OneToOne(type => TextEntity)
	@JoinColumn()
	public previousText: TextEntity;

	@OneToMany(
		type => ParagraphEntity,
		paragraph => paragraph.text,
	)
	public paragraphs: ParagraphEntity[];

	@Column({ type: 'int' })
	public depth: number;

	@Column({ type: 'int' })
	public pointer: number;

	@Column({ type: 'int' })
	public branches: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	// Constructor
	constructor(
		id: number = 0,
		text: string = '',
		tag: string = '',
		html: string = '',
		author: UserEntity = null,
		previousText: TextEntity = null,
		depth: number = 0,
		pointer: number = 0,
		branches: number = 0,
		createdAt: Date = new Date(),
		updatedAt: Date = new Date(),
	) {
		this.id = id;
		this.text = text;
		this.tag = tag;
		this.html = html;
		this.author = author;
		this.previousText = previousText;
		this.depth = depth;
		this.pointer = pointer;
		this.branches = branches;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public async getText(): Promise<Text> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(
					new Text(
						this.text, 
						this.tag,
						this.html,
						this.createdAt, 
						this.updatedAt));
			} catch (err) {
				reject(err);
			}
		});
	}

	public async setText(text: Text): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				this.id = 0;
				this.text = text.text;
				this.tag = text.tag;
				this.html = text.html;
				this.createdAt = text.createdAt;
				this.updatedAt = text.updatedAt;
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
					text: this.text,
					tag: this.tag,
					html: this.html,
					author: this.author.getJSON(),
					depth: this.depth,
					pointer: this.pointer,
					branches: this.branches,
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
				if (json.hasOwnProperty('text')) this.text = json.text;
				if (json.hasOwnProperty('tag')) this.tag = json.tag;
				if (json.hasOwnProperty('html')) this.html = json.html;
				if (json.hasOwnProperty('author')) this.author = json.author;
				if (json.hasOwnProperty('depth')) this.depth = json.depth;
				if (json.hasOwnProperty('pointer')) this.pointer = json.pointer;
				if (json.hasOwnProperty('branches')) this.branches = json.branches;
				if (json.hasOwnProperty('createdAt')) this.createdAt = json.createdAt;
				if (json.hasOwnProperty('updatedAt')) this.updatedAt = json.updatedAt;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async parseJSONs(json: any[]): Promise<TextEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let entities: TextEntity[] = new Array<TextEntity>(json.length);
				for (let i = 0; i < entities.length; i++) {
					entities[i] = new TextEntity();
					if (json[i].hasOwnProperty('id')) entities[i].id = json[i].id;
					if (json[i].hasOwnProperty('text')) entities[i].text = json[i].text;
					if (json[i].hasOwnProperty('tag')) entities[i].tag = json[i].tag;
					if (json[i].hasOwnProperty('html')) entities[i].html = json[i].html;
					if (json[i].hasOwnProperty('author')) entities[i].author = json[i].author;
					if (json[i].hasOwnProperty('depth')) entities[i].depth = json[i].depth;
					if (json[i].hasOwnProperty('pointer')) entities[i].pointer = json[i].pointer;
					if (json[i].hasOwnProperty('branches')) entities[i].branches = json[i].branches;
					if (json[i].hasOwnProperty('createdAt')) entities[i].createdAt = json[i].createdAt;
					if (json[i].hasOwnProperty('updatedAt')) entities[i].updatedAt = json[i].updatedAt;
				}
				resolve(entities);
			} catch (err) {
				reject(err);
			}
		});
	}
}
