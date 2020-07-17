import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLeftnavComponent } from './content-leftnav.component';

describe('ContentLeftnavComponent', () => {
	let component: ContentLeftnavComponent;
	let fixture: ComponentFixture<ContentLeftnavComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContentLeftnavComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContentLeftnavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
