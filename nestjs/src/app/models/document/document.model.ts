/*****************************************************************************
 *  DEPENDENCIES
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { DocumentEntity } from 'app/entities/document.entity';
import { UserEntity } from 'app/entities/user.entity';
import { CorpusEntity } from 'app/entities/corpus.entity';
import { ParagraphEntity } from 'app/entities/paragraph.entity';
import { TextEntity } from 'app/entities/text.entity';
import { CorpusModel } from '../corpus/corpus.model';

@Injectable()
export class DocumentModel {
	constructor(
		@InjectRepository(DocumentEntity)
		private documentRepository: Repository<DocumentEntity>,

		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,

		@InjectRepository(CorpusEntity)
		private corpusRepository: Repository<CorpusEntity>,

		@InjectRepository(ParagraphEntity)
		private paragraphRepository: Repository<ParagraphEntity>,

		@InjectRepository(TextEntity)
		private textRepository: Repository<TextEntity>,
	) {
		// let user:UserEntity = await this.userRepository.findOne(1);
		// let corpus = await this.corpusRepository.findOne({id: 2});
		// let document = await this.documentRepository.findOne({id: 2});
		// let paragraphs = new Array<ParagraphEntity>(3);
		// paragraphs[0] = await this.paragraphRepository.findOne({id: 1});
		// paragraphs[1] = await this.paragraphRepository.findOne({id: 2});
		// paragraphs[2] = await this.paragraphRepository.findOne({id: 3});
		// let texts = new Array<TextEntity>(3);
		// texts[0] = await this.textRepository.findOne({id: 1});
		// texts[1] = await this.textRepository.findOne({id: 2});
		// texts[2] = await this.textRepository.findOne({id: 3});
		// document.author = Promise.resolve(user);
		// document.corpus = Promise.resolve(corpus);
		// document.paragraphs = Promise.resolve(paragraphs);
		// paragraphs[0].text = Promise.resolve(texts[0]);
		// paragraphs[1].text = Promise.resolve(texts[1]);
		// paragraphs[2].text = Promise.resolve(texts[2]);
		// texts[0].author = Promise.resolve(user);
		// texts[1].author = Promise.resolve(user);
		// texts[2].author = Promise.resolve(user);
		// paragraphs[0].document = Promise.resolve(document);
		// paragraphs[1].document = Promise.resolve(document);
		// paragraphs[2].document = Promise.resolve(document);
		// await this.userRepository.save(user);
		// await this.corpusRepository.save(corpus);
		// await this.documentRepository.save(document);
		// await this.paragraphRepository.save(paragraphs);
		// await this.textRepository.save(texts);
		// const document = await this.documentRepository.findOne({id: 4}, { relations: ["corpus", "author", "paragraphs"] });
		// const document = await this.documentRepository.findOne({id: 4});
		// const paragraphs = await document.paragraphs;
		// console.log(user);
		// console.log(corpus);
		// let nick = await this.userRepository.findOne(1, {relations: ["documents", "texts"]});
		// let newDocument = await this.documentRepository.createQueryBuilder("document")
		// 					.innerJoinAndSelect("document.paragraphs", "paragraphs")
		// 					.innerJoinAndSelect("paragraphs.text", "text")
		// 					.getMany();
		// console.log(newDocument);
		// newDocument[0].paragraphs.forEach((paragraph, i) => {
		// 	console.log(paragraph);
		// });
		// let myDocuments = await nick.documents;
		// console.log(myDocuments);
		// let paragraphsss = await newDocument.paragraphs;
		// let text = await paragraphs[0].text;
		// console.log(newDocument.paragraphs);
		// console.log(paragraphs);
		// console.log(text);
		// console.log(corpus);
		// console.log(document);
		// console.log(paragraphs);
		// let newDocument = new DocumentEntity();
		// newDocument.corpus = Promise.resolve(corpus);
		// newDocument.author = Promise.resolve(user);
		// newDocument.createdAt = new Date();
		// newDocument.updatedAt = new Date();
		// const texts: TextEntity[] = [
		// 	new TextEntity(1, "text: " + 1, user, null, 0,0,0,new Date(), new Date()),
		// 	new TextEntity(2, "text: " + 2, user, null, 0,0,0,new Date(), new Date()),
		// 	new TextEntity(3, "text: " + 3, user, null, 0,0,0,new Date(), new Date()),
		// ];
		// const paragraphs: ParagraphEntity[] = [
		// 	new ParagraphEntity(1, document, texts[0], 0, new Date(), new Date()),
		// 	new ParagraphEntity(2, document, texts[1], 1, new Date(), new Date()),
		// 	new ParagraphEntity(3, document, texts[2], 2, new Date(), new Date()),
		// ]
	}

	/*
	userRepository.find({
		select: ["firstName", "lastName"],
		relations: ["profile", "photos", "videos"],
		where: {
			firstName: "Timber",
			lastName: "Saw"
		},
		order: {
			name: "ASC",
			id: "DESC"
		},
		skip: 5,
		take: 10,
		cache: true
	});
*/

	/*****************************************************************************
	 *  UPSERT
	 *****************************************************************************/
	public async UpsertByAuthorAndCorpus(author: UserEntity, corpus: CorpusEntity): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const document = await this.documentRepository
					.findOne(
						{
							corpus: corpus,
							author: author,
						},
						{ relations: ['corpus', 'author'] },
					)
					.catch(err => {
						throw 'Error finding the document';
					});

				if (document != undefined || document != null) resolve(document);
				else {
					const newDocument = await this.documentRepository
						.save({
							corpus: corpus,
							author: author,
						})
						.catch(err => {
							throw 'Error finding the document';
						});
					resolve(newDocument);
				}
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/
	public async findOneByDocumentWithTexts(document: DocumentEntity): Promise<DocumentEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntity = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.id = ' + document.id)
					.orderBy('paragraphs.order', 'ASC')
					.getMany()
					.catch(err => {
						throw 'Error finding the document';
					});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findTextsByCorpusWithoutAuthor(corpus: CorpusEntity, author: UserEntity): Promise<TextEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const entityManager = getManager();

				const result: any = await entityManager
					.query(
						`
					SELECT DISTINCT texts.id, texts.text, texts.depth, texts.pointer, texts.branches, texts.createdAt, texts.updatedAt, texts.author
					FROM corpora, users, documents, paragraphs, texts
					WHERE 
						${corpus.id} = corpora.id AND 
						corpora.id = documents.corpus AND
						documents.id = paragraphs.document AND
						paragraphs.text = texts.id AND
						${author.id} <> documents.author
					`,
					)
					.catch(err => {
						throw err;
					});
				const texts: TextEntity[] = await TextEntity.parseJSONs(result);
				resolve(texts);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*
	public async findOneByID(id: number): Promise<UserEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const userEntity = await this.userRepository.findOne({ id: id }).catch(err => {
					throw 'Error finding the user';
				});
				resolve(userEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByUsername(username: string): Promise<UserEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(
					await this.userRepository.findOne({ username: username }).catch(err => {
						throw 'Error finding the user';
					}),
				);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  SAVE
	 *****************************************************************************/
	public async save(document: DocumentEntity): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const savedDocument = await this.documentRepository.save(document).catch(err => {
					throw 'Error finding the user';
				});
				resolve(savedDocument);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  CHECK
	 *****************************************************************************/
	/*
	public async CheckUsernameAndEmailDontExist(username: string, email: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.userRepository
					.count({
						where: [{ username: username }, { email: email }],
					})
					.catch(err => {
						throw 'Error counting the user';
					});
				if (count > 0) throw 'Invalid username or email. It already exists';
				else resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  DELETE
	 *****************************************************************************/
}
