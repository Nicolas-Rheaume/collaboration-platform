import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConceptComponent } from './create-concept.component';

describe('CreateConceptComponent', () => {
  let component: CreateConceptComponent;
  let fixture: ComponentFixture<CreateConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateConceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
