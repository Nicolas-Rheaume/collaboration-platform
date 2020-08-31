/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { Controller, Logger, Get, Render } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { environment } from 'environments/environment';

// Services
import { ConnectionService } from 'app/models/connection/connection.service';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { Corpus, CorpusEntity } from 'app/models/corpus/corpus.entity';
import { DocumentModel } from 'app/models/document/document.model';
import { Document } from 'app/models/document/document.entity';
import { User } from 'app/models/user/user.entity';
import { UserModel } from 'app/models/user/user.model';

/*****************************************************************************
 *  AUTHENTICATE CONTROLLER
 *****************************************************************************/
@Controller('document')
export class DocumentController {
	// Variables
	private logger: Logger = new Logger('Document Controller');

	// Contructor
	constructor(private readonly cs: ConnectionService, private readonly corpusModel: CorpusModel, private readonly documentModel: DocumentModel, private readonly userModel: UserModel) {
		this.logger.log('Initialized!');
	}

	// Information
	// public async document(socket: Socket, title: string, user: string): Promise<Document> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const corpusEntity = await this.corpusModel.findOneByTitle(title).catch(err => {
	// 				throw err;
	// 			});
	// 			const userEntity = await this.userModel.findOneByUsername(user).catch(err => {
	// 				throw err;
	// 			});
	// 			const documentEntity = await this.documentModel.findOneByCorpusAndAuthorWithTexts(corpusEntity.id, userEntity.id).catch(err => {
	// 				throw err;
	// 			});

	// 			let document = new Document();
	// 			document.author = userEntity.username;
	// 			document.corpus = corpusEntity.title;
	// 			document.createdAt = documentEntity.createdAt;
	// 			document.updatedAt = documentEntity.updatedAt;

	// 			document.texts = new Array(documentEntity.paragraphs.length);
	// 			for(let i = 0 ; i < document.texts.length; i++){
	// 				document.texts[i] = await documentEntity.paragraphs[i].text.getText();
	// 			}
	// 			resolve(document);
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }

	// // Documents
	// public async documents(socket: Socket, title: string): Promise<Document[]> {
	// 	return new Promise<any>(async (resolve, reject) => {
	// 		try {
	// 			const corpusEntity = await this.corpusModel.findOneByTitle(title).catch(err => {
	// 				throw err;
	// 			});

	// 			const documentEntities = await this.documentModel.findDocumentsByCorpusID(corpusEntity.id).catch(err => {
	// 				throw err;
	// 			});

	// 			let documents: Document[] = new Array(documentEntities.length);
	// 			for(let i = 0; i < documentEntities.length; i++) {
	// 				documents[i] = new Document(
	// 					documentEntities[i].author.username,
	// 					null,
	// 					null,
	// 					documentEntities[i].createdAt,
	// 					documentEntities[i].updatedAt
	// 				);
	// 			}
	// 			resolve(documents)
	// 		} catch (err) {
	// 			reject(err);
	// 		}
	// 	});
	// }
}
