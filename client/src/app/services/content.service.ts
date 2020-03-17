import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Observable, Subscription } from 'rxjs';

import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

import { User } from '../models/user.model';
import { Subject } from '../models/subject.model';
import { Text } from '../models/text.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  /*****************************************************************************
   *  VARIABLES
   ****************************************************************************/
  private apiURL = environment.api + '/content';
  private socket: SocketIOClient.Socket = io(this.apiURL);
  private sub: Subscription;

  private user: User = new User();
  public subject: Subject = new Subject();
  public editorText: Text[] = [];
  public explorerText: Text[] = [];

  /*****************************************************************************
   *  MAIN
   ****************************************************************************/
  constructor(
    private us: UserService,
    private activeRouter: ActivatedRoute,
  ) { 

    // Error message
    // Subscribe content
    this.sub = this.errorMessage().subscribe(message => {
      console.log(message);
    });

    // Get the Active Route parameter
    this.sub = this.activeRouter.params.subscribe(params => {

      // Get the current User
      if(this.us.isConnected){
        this.sub = this.us.getLoggedUser().subscribe(user => {

          // Set User
          this.user = user;

          // Subscribe content
          this.sub = this.contentResponse().subscribe(content => {
            this.subject = Subject.map(content.subject);
            this.editorText = Text.maps(content.editorText);
            this.explorerText = Text.maps(content.explorerText);
            console.log(content);
          })

        });
      }
    });

  }


   /*****************************************************************************
   *  WEB SOCKETS RESPONSE
   ****************************************************************************/

  public editorResponse = () => {
    return Observable.create((observer) => {
        this.socket.on('editor-response', (message) => {
            observer.next(message);
        });
    });
  }

  public contentResponse = () => {
    return Observable.create((observer) => {
        this.socket.on('contentResponse', (message) => {
          console.log(message);
            observer.next(message);
        });
    });
  }

  public errorMessage = () => {
    return Observable.create((observer) => {
        this.socket.on('errorMessage', (message) => {
            observer.next(message);
        });
    });
  }



  /*****************************************************************************
   *  WEB SOCKETS REQUEST
   ****************************************************************************/

   public saveEditorText() {
    this.socket.emit('createContent', {
      username: this.user.username, 
      title: this.subject.title,
      texts: [this.editorText],
    });
   }


  public getContent(username: string, title: string) {
    this.socket.emit('getContent', {username: username, title: title});
  }
  
  /*
   public saveContent() {
    this.socket.emit('createContent', {username: username, title: title});
   }
   */
   /*
  public registerSocket(user: User) {
    this.socket.emit('register', user);
  }
  */
}
