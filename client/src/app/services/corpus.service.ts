import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from './socket.service';

import { Corpus } from '../models/corpus.model';

@Injectable({
	providedIn: 'root',
})
export class CorpusService {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	private sub: Subscription;

	// Dashboard
	public settings = {
		search: '',
		sort: 'recent',
		contributor: '',
	};
	public corpora: Corpus[] = [] as Corpus[];

	/*
  private apiURL = environment.api + '/corpus';
  private socket: SocketIOClient.Socket = io(this.apiURL);

  public corpora: Corpus[] = [] as Corpus[];
  */

	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor(private socket: SocketService, private activeRouter: ActivatedRoute) {
		console.log('Corpus Service');

		// All Corpora Response
		this.sub = this.socket.response('dashboard/pages').subscribe(corpora => {
			console.log(corpora);
			this.corpora = Corpus.maps(corpora);
		});

		// Get Dashboard Corpora
		/*
    this.sub = this.dashboardCorporaResponse().subscribe(corpora => {
      console.log(corpora);
      this.corpora = Corpus.maps(corpora);
    });
    */
	}

	/*****************************************************************************
	 *  WEB SOCKETS RESPONSE
	 ****************************************************************************/
	/*
  public dashboardCorporaResponse = () => {
    return Observable.create((observer) => {
        this.socket.on('corpora-response', (message) => {
            observer.next(message);
        });
    });
  }


  public getAllCorporaResponse = () => {
    return Observable.create((observer) => {
        this.socket.on('get-all-response', (message) => {
            observer.next(message);
        });
    });
  }

  public get = () => {
    return Observable.create((observer) => {
        this.socket.on('get', (message) => {
            observer.next(message);
        });
    });
  }

  public update = () => {
    return Observable.create((observer) => {
        this.socket.on('update', (message) => {
            observer.next(message);
        });
    });
  }

  public corpusCreated = () => {
    return Observable.create((observer) => {
        this.socket.on('new-corpus-response', (message) => {
            observer.next(message);
        });
    });
  }

   /*****************************************************************************
   *  WEB SOCKETS REQUEST
   ****************************************************************************/
	/*

   public getDashboardCorpora() {
    this.socket.emit('get-all');
   }

  createNewCorpus(title: string) {
    this.socket.emit('create-new-corpus', title);
  }

  public getAll() {
    this.socket.emit('get-all');
  }

  public getCorpus(id: number) {
    this.socket.emit('get corpus by id', id);
  }

  public create(corpus: Corpus) {
    console.log(corpus);
    this.socket.emit('create', corpus);
  }

  public delete(corpus: Corpus) {
    this.socket.emit('delete', corpus);
  }

  public save(corpus: Corpus) {
    this.socket.emit('save', corpus);
  }
  */
}
