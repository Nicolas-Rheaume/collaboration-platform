import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditorOverviewComponent } from './content-editor-overview.component';

describe('ContentEditorOverviewComponent', () => {
	let component: ContentEditorOverviewComponent;
	let fixture: ComponentFixture<ContentEditorOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContentEditorOverviewComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContentEditorOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
