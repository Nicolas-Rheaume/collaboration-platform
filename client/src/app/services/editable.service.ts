import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class EditableService {
	constructor() {}

	/*
  // Socket request
  public request(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Socket response
  public response(event: string): Observable<any> {
    return Observable.create((observer) => {
      this.socket.on(event, (data) => {
          observer.next(data);
      });
    });
  }
  */
}
