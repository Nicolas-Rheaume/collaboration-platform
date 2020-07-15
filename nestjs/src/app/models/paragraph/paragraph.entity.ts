/*****************************************************************************
 *  PARAGRAPH ENTITY FOR THE SERVER SIDE
 *****************************************************************************/
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { CorpusEntity, Corpus } from '../corpus/corpus.entity';
import { UserEntity, User } from '../user/user.entity';
import { TextEntity } from '../text/text.entity';
import { DocumentEntity } from '../document/document.entity';

@Entity('paragraphs')
export class ParagraphEntity {
	// Variables
	@PrimaryGeneratedColumn()
	public id: number;

	@ManyToOne(
		type => DocumentEntity,
		document => document.paragraphs,
	)
	@JoinColumn({ name: 'document' })
	public document: DocumentEntity;

	@ManyToOne(
		type => TextEntity,
		text => text.paragraphs,
	)
	@JoinColumn({ name: 'text' })
	public text: TextEntity;

	@Column({ type: 'int' })
	public order: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	// Constructor
	constructor(
		id: number = 0, 
		document: DocumentEntity = null, 
		text: TextEntity = null, 
		order: number = 0, 
		createdAt: Date = new Date(), 
		updatedAt: Date = new Date()
	) {
		this.id = id;
		this.document = document;
		this.text = text;
		this.order = order;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	// public async get(): Promise<Corpus> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			resolve(new Corpus(this.title, this.url, this.contributors, this.texts, this.createdAt, this.updatedAt));
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

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
