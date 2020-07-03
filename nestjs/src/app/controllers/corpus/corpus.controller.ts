/*****************************************************************************
 *  IMPORTS
 *****************************************************************************/
// Dependencies
import { Controller, Logger, Get, Render } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { environment } from 'environments/environment';

// Services
import { ConnectionService } from 'app/services/connection/connection.service';
import { CorpusModel } from 'app/models/corpus/corpus.model';
import { Corpus, CorpusEntity } from 'app/entities/corpus.entity';
import { DocumentModel } from 'app/models/document/document.model';
import { Document } from 'app/entities/document.entity';
import { User } from 'app/entities/user.entity';

/*****************************************************************************
 *  AUTHENTICATE CONTROLLER
 *****************************************************************************/
@Controller('corpus')
export class CorpusController {
	// Variables
	private logger: Logger = new Logger('Corpus Controller');

	// Contructor
	constructor(private readonly cs: ConnectionService, private readonly corpusModel: CorpusModel, private readonly documentModel: DocumentModel) {
		this.logger.log('Initialized!');
	}

	// Information
	public async information(socket: Socket, title: string): Promise<Corpus> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const corpusEntity = await this.corpusModel.findOneByTitle(title).catch(err => {
					throw err;
				});

				const contributorCount = this.documentModel.countContributors(corpusEntity.id).catch(err => {
					throw err;
				});

				const documentCount = this.documentModel.countDocuments(corpusEntity.id).catch(err => {
					throw err;
				});

				const textCount = 0;

				Promise.all([contributorCount, documentCount, textCount]).then(async values => {
					let corpus = await corpusEntity.getCorpus().catch(err => {
						throw err;
					});

					corpus.contributors = values[0];
					corpus.documents = values[1];
					corpus.texts = values[2];
					resolve(corpus);
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	// Documents
	public async documents(socket: Socket, title: string): Promise<Document[]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const corpusEntity = await this.corpusModel.findOneByTitle(title).catch(err => {
					throw err;
				});

				const documentEntities = await this.documentModel.findDocumentsByCorpusID(corpusEntity.id).catch(err => {
					throw err;
				});

				let documents: Document[] = new Array(documentEntities.length);
				for(let i = 0; i < documentEntities.length; i++) {
					documents[i] = new Document(
						documentEntities[i].author.username,
						null,
						null,
						documentEntities[i].createdAt,
						documentEntities[i].updatedAt
					);
				}
				resolve(documents)
			} catch (err) {
				reject(err);
			}
		});
	}
}
