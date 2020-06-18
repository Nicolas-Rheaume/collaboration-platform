import { Controller } from '@nestjs/common';
import express, { Application } from 'express';
import { Socket, Server } from 'socket.io';

import { ConnectionService } from 'app/services/connection/connection.service';

import { CorpusModel } from 'app/models/corpus/corpus.model';
import { Corpus, CorpusEntity, CorpusSort } from 'app/entities/corpus.entity';
import { environment } from 'environments/environment';

@Controller('dashboard')
export class DashboardController {
	constructor(private readonly cs: ConnectionService, private readonly corpusModel: CorpusModel) {}

	// Create a new Corpus
	public async createCorpus(client: Socket, title: string): Promise<Corpus[]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const [cleanedTitle, url] = await this.validateTitle(title).catch(err => {
					throw err;
				});
				await this.corpusModel.checkTitleDoesntExists(cleanedTitle).catch(err => {
					throw err;
				});
				await this.corpusModel.create(cleanedTitle, url).catch(err => {
					throw err;
				});

				const search = this.cs.getConnection(client).dashboardSearch;
				const corpora = await this.corpusModel.findBySearch(search.search, search.sort).catch(err => {
					throw err;
				});
				resolve(await Corpus.parseEntities(corpora));
			} catch (err) {
				reject(err);
			}
		});
	}

	// Update a new Corpus
	public async updateCorpus(client: Socket, title: string): Promise<Corpus[]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				await this.corpusModel.updateTitle(title).catch(err => {
					throw err;
				});
				const search = this.cs.getConnection(client).dashboardSearch;
				const corpora = await this.corpusModel.findBySearch(search.search, search.sort).catch(err => {
					throw err;
				});
				resolve(await Corpus.parseEntities(corpora));
			} catch (err) {
				reject(err);
			}
		});
	}

	// Delete a new Corpus
	public async deleteCorpus(client: Socket, title: string): Promise<Corpus[]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				await this.corpusModel.deleteByTitle(title).catch(err => {
					throw err;
				});
				const search = this.cs.getConnection(client).dashboardSearch;
				const corpora = await this.corpusModel.findBySearch(search.search, search.sort).catch(err => {
					throw err;
				});
				resolve(await Corpus.parseEntities(corpora));
			} catch (err) {
				reject(err);
			}
		});
	}

	// Create a new Corpus
	public async validateTitle(title: string): Promise<[string, string]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				if (title === '' || title === null) throw "Corpus title can't be empty";
				const name: string = title.replace(/\s\s+/g, ' ');
				const nameSplit: string[] = name.split(' ');
				if (nameSplit[0] == '') nameSplit.splice(0, 1);
				if (nameSplit[nameSplit.length - 1] == '') nameSplit.splice(-1, 1);
				const nameJoin: string = nameSplit.join(' ');
				const path = ('/' + nameJoin).replace(/ /g, '_').match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g);
				if (path === null || path.length != 1) throw 'Corpus URL is invalid';
				const url = path[0];
				resolve([nameJoin, url]);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Find All corpora
	public async findAll(client: Socket): Promise<[Corpus[], string, CorpusSort]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				const search = this.cs.getConnection(client).dashboardSearch;
				const corporaEntity = await this.corpusModel.findBySearch(search.search, search.sort).catch(err => {
					throw err;
				});
				const corpora = await Corpus.parseEntities(corporaEntity);
				resolve([corpora, search.search, search.sort]);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Search Corpus
	public async searchCorpora(client: Socket, search: string, sort: CorpusSort): Promise<Corpus[]> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				this.cs.getConnection(client).dashboardSearch.search = search;
				this.cs.getConnection(client).dashboardSearch.sort = sort;

				const corpora = await this.corpusModel.findBySearch(search, sort).catch(err => {
					throw err;
				});
				resolve(await Corpus.parseEntities(corpora));
			} catch (err) {
				reject(err);
			}
		});
	}
}
