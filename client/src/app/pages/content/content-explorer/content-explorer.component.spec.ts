import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentExplorerComponent } from './content-explorer.component';

describe('ContentExplorerComponent', () => {
  let component: ContentExplorerComponent;
  let fixture: ComponentFixture<ContentExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
