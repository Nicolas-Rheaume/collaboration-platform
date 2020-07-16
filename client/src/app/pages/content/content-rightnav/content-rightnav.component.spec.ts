import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRightnavComponent } from './content-rightnav.component';

describe('ContentRightnavComponent', () => {
  let component: ContentRightnavComponent;
  let fixture: ComponentFixture<ContentRightnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRightnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRightnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
