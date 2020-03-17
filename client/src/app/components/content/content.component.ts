import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from 'rxjs';

import { SubjectService } from '../../services/subject.service';
import { ContentService } from 'src/app/services/content.service';
import { UserService } from 'src/app/services/user.service';

import { Subject } from '../../models/subject.model';
import { Text } from '../../models/text.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  public subject: Subject = new Subject();
  public texts: Text = new Text();

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private ss: SubjectService,
    private cs: ContentService,
    private us: UserService
  ) { }

  ngOnInit() {

    // Get the Active Route parameter
    this.sub = this.activeRouter.params.subscribe(params => {

      // Get the current User
      if(this.us.isConnected){
        this.sub = this.us.getLoggedUser().subscribe(user => {

          // Subscribe content
          this.sub = this.cs.contentResponse().subscribe(content => {
            this.subject = Subject.map(content.subject);
            console.log(content.subject);
          });

          // Get content
          this.cs.getContent(user.username, params.title);
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }



}
