import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLeftnavTableofcontentComponent } from './content-leftnav-tableofcontent.component';

describe('ContentLeftnavTableofcontentComponent', () => {
	let component: ContentLeftnavTableofcontentComponent;
	let fixture: ComponentFixture<ContentLeftnavTableofcontentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContentLeftnavTableofcontentComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContentLeftnavTableofcontentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
