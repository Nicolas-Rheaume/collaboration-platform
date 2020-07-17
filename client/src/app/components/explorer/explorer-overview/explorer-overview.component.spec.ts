import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerOverviewComponent } from './explorer-overview.component';

describe('ExplorerOverviewComponent', () => {
	let component: ExplorerOverviewComponent;
	let fixture: ComponentFixture<ExplorerOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ExplorerOverviewComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ExplorerOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
