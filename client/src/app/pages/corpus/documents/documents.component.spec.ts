import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpusDocumentsComponent } from './documents.component';

describe('DocumentsComponent', () => {
  let component: CorpusDocumentsComponent;
  let fixture: ComponentFixture<CorpusDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpusDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
