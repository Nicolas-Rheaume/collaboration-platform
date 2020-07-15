/*****************************************************************************
 *  DEPENDENCIES
 *****************************************************************************/
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { DocumentEntity } from 'app/models/document/document.entity';
import { UserEntity } from 'app/models/user/user.entity';
import { CorpusEntity } from 'app/models/corpus/corpus.entity';
import { ParagraphEntity } from 'app/models/paragraph/paragraph.entity';
import { TextEntity } from 'app/models/text/text.entity';
import { CorpusModel } from '../corpus/corpus.model';
import { ParagraphModel } from '../paragraph/paragraph.model';
import { TextModel } from '../text/text.model';
import { UserModel } from '../user/user.model';
import { ConceptModel } from '../concept/concept.model';

@Injectable()
export class DocumentModel {
	constructor(
		@InjectRepository(DocumentEntity)
		private documentRepository: Repository<DocumentEntity>,
		private paragraphModel: ParagraphModel,
		private textModel: TextModel,
		private userModel: UserModel,
	) {

	}

	/*****************************************************************************
	 *  CREATE
	 *****************************************************************************/
	public async createByCorpusandOrder(corpus: CorpusEntity, order: number): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.documentRepository.insert({
					title: '',
					description: '',
					corpus: corpus,
					order: order
				}).catch(err => {
						throw 'error creating the document';
				});

				const documentEntity = await this.documentRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  COPY
	 *****************************************************************************/

	public async copyOneToCorpus(document: DocumentEntity, corpus: CorpusEntity): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.documentRepository.insert({
					title: document.title,
					description: document.description,
					corpus: corpus,
					order: document.order
				}).catch(err => {
						throw 'error creating the document';
				});
				const documentEntity = await this.documentRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				this.paragraphModel.copyManyToDocument(document.paragraphs, documentEntity).catch(err => {
					throw err;
				});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyOneToCorpusAtIndex(document: DocumentEntity, corpus: CorpusEntity, index: number): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.documentRepository.insert({
					title: document.title,
					description: document.description,
					corpus: corpus,
					order: index
				}).catch(err => {
						throw 'error creating the document';
				});
				const documentEntity = await this.documentRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				this.paragraphModel.copyManyToDocument(document.paragraphs, documentEntity).catch(err => {
					throw err;
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyOneByIDToCorpus(documentID: number, corpus: CorpusEntity): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const document = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.where('document.id = ' + documentID)
					.getOne()
					.catch(err => {
						throw 'Error finding the document';
					});

				const data = await this.documentRepository.insert({
					title: document.title,
					description: document.description,
					corpus: corpus,
					order: document.order
				}).catch(err => {
						throw 'error creating the document';
				});
				const documentEntity = await this.documentRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				this.paragraphModel.copyManyToDocument(document.paragraphs, documentEntity).catch(err => {
					throw err;
				});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyOneByIDToCorpusAtIndex(documentID: number, corpus: CorpusEntity, index: number): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const document = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.where('document.id = ' + documentID)
					.getOne()
					.catch(err => {
						throw 'Error finding the document';
					});

				const data = await this.documentRepository.insert({
					title: document.title,
					description: document.description,
					corpus: corpus,
					order: index
				}).catch(err => {
						throw 'error creating the document';
				});
				const documentEntity = await this.documentRepository.findOne(data.raw.insertId).catch(err => {
					throw err;
				});
				this.paragraphModel.copyManyToDocument(document.paragraphs, documentEntity).catch(err => {
					throw err;
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	public async copyManyToCorpus(documents: DocumentEntity[], corpus: CorpusEntity): Promise<DocumentEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(documents.length);
				documents.forEach(async (document, i) => {
					promises[i] = this.copyOneByIDToCorpus(document.id, corpus).catch(err => {
						throw err;
					});
				});
				Promise.all(promises).then((documentEntities: DocumentEntity[]) => {
					resolve(documentEntities);
				}).catch(err => {
					throw err;
				}); 
			} catch (err) {
				reject(err);
			}
		});
	}


	// public async UpsertByAuthorAndCorpus(author: UserEntity, corpus: CorpusEntity): Promise<DocumentEntity> {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const document = await this.documentRepository
	// 				.findOne(
	// 					{
	// 						corpus: corpus,
	// 						author: author,
	// 					},
	// 					{ relations: ['corpus', 'author'] },
	// 				)
	// 				.catch(err => {
	// 					throw 'Error finding the document';
	// 				});

	// 			if (document != undefined || document != null) resolve(document);
	// 			else {
	// 				const newDocument = await this.documentRepository
	// 					.save({
	// 						corpus: corpus,
	// 						author: author,
	// 					})
	// 					.catch(err => {
	// 						throw 'Error finding the document';
	// 					});
	// 				resolve(newDocument);
	// 			}
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	/*****************************************************************************
	 *  INSERT
	 *****************************************************************************/
	public async insertCopyAtIndex(corpus: CorpusEntity, document: DocumentEntity, index: number): Promise<DocumentEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.updateOrdersAtIndex(corpus.documents.splice(index), index + 1).catch(err => {
					throw err;
				});
				await this.copyOneToCorpusAtIndex(document, corpus, index).catch(err => {
					throw err;
				});
				const documentEntities: DocumentEntity[] = await this.findManyByCorpusIDWithTexts(corpus.id).catch(err => {
					throw err;
				});
				resolve(documentEntities);
			} catch (err) {
				reject(err);
			}
		});
	}

	/*****************************************************************************
	 *  FIND
	 *****************************************************************************/

	public async findOneByIDWithTexts(id: number): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntity = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.id = ' + id)
					.orderBy('paragraphs.order', 'ASC')
					.getOne()
					.catch(err => {
						throw 'Error finding the document';
					});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByCorpusIDAndOrderWithTexts(corpusID: number, order: number): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntity = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.corpus = ' + corpusID)
					.andWhere('document.order = ' + order)
					.orderBy('paragraphs.order', 'ASC')
					.getOne()
					.catch(err => {
						throw 'Error finding the document';
					});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}


	public async findOneByDocumentWithTexts(document: DocumentEntity): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntity = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.id = ' + document.id)
					.orderBy('paragraphs.order', 'ASC')
					.getOne()
					.catch(err => {
						throw 'Error finding the document';
					});
				resolve(documentEntity);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findOneByCorpusAndAuthorWithTexts(corpusID: number, authorID: number): Promise<DocumentEntity> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntity = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.corpus = ' + corpusID)
					.andWhere('document.author = ' + authorID)
					.orderBy('paragraphs.order', 'ASC')
					.getOne()
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

	public async findDocumentsByCorpusID(corpusID: number): Promise<DocumentEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const documents: DocumentEntity[] = await this.documentRepository
					.createQueryBuilder('documents')
					.where(`documents.corpus = ${corpusID}`)
					.orderBy('documents.order')
					.getMany()
					.catch(err => {
						throw 'Error searching for documents';
					});
				resolve(documents);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findManyByCorpusAndAuthorWithTexts(corpusID: number, authorID: number): Promise<DocumentEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntities = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.corpus = ' + corpusID)
					.andWhere('document.author = ' + authorID)
					.orderBy('paragraphs.order', 'ASC')
					.getMany()
					.catch(err => {
						throw 'Error finding the document';
					});
				resolve(documentEntities);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async findManyByCorpusIDWithTexts(corpusID: number): Promise<DocumentEntity[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const documentEntities = await this.documentRepository
					.createQueryBuilder('document')
					.innerJoinAndSelect('document.paragraphs', 'paragraphs')
					.innerJoinAndSelect('paragraphs.text', 'text')
					.where('document.corpus = ' + corpusID)
					.orderBy('paragraphs.order', 'ASC')
					.getMany()
					.catch(err => {
						throw 'Error finding the document';
					});
				resolve(documentEntities);
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
	 *  UPDATE
	 *****************************************************************************/
	public async updateTitleByID(documentID: number, title: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.documentRepository.update(
					{ id: documentID }, 
					{ title: title }
				).catch(err => {
					throw 'Error updating the title of the document';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
	
	 public async updateDescriptionByID(documentID: number, description: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.documentRepository.update(
					{ id: documentID }, 
					{ description: description }
				).catch(err => {
					throw 'Error updating the description of the document';
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public async updateOrders(documents: DocumentEntity[]): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(documents.length);
				documents.forEach(async (document, i) => {
					promises[i] = await this.documentRepository.update(
						{id: document.id},
						{order: i}
					).catch(err => {
						throw 'Error updating the order of the document';
					});
				});
				Promise.all(promises).then(() => {
					resolve();
				}).catch(err => {
					throw err;
				}); 
			} catch (err) {
				reject(err);
			}
		});
	}

	public async updateOrdersAtIndex(documents: DocumentEntity[], index: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				let promises = new Array(documents.length);
				documents.forEach(async (document, i) => {
					promises[i] = await this.documentRepository.update(
						{id: document.id},
						{order: index + i}
					).catch(err => {
						throw 'Error updating the order of the document';
					});
				});
				Promise.all(promises).then(() => {
					resolve();
				}).catch(err => {
					throw err;
				}); 
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

	/*****************************************************************************
	 *  COUNT
	 *****************************************************************************/
	public async countContributors(corpus: number): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.documentRepository
					.createQueryBuilder('document')
					.where(`document.corpus = ${corpus}`)
					.groupBy('document.author')
					.getManyAndCount()
					.catch(err => {
						throw 'Error counting the contributors';
					});

				resolve(count.length);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async countDocuments(corpus: number): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.documentRepository.count({ where: { corpus: corpus } }).catch(err => {
					throw 'Error counting the corpora';
				});
				resolve(count);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async countTexts(corpus: number): Promise<number> {
		return new Promise(async (resolve, reject) => {
			try {
				const count = await this.documentRepository.count({ where: { corpus: corpus } }).catch(err => {
					throw 'Error counting the corpora';
				});
				resolve(count);
			} catch (err) {
				reject(err);
			}
		});
	}
}
