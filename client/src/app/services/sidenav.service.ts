import { Injectable } from '@angular/core';

export const NONE_WIDTH = 0;
export const RAIL_WIDTH = 50;
export const DRAWER_WIDTH = 250;

export enum SideNavState {
	NONE,
	RAIL,
	DRAWER,
}

export enum SideNavComponent {
	NONE,
	TABLE_OF_CONTENT,
	CONTENT_MENU,

}

@Injectable({
	providedIn: 'root',
})
export class SideNavService {
	/*****************************************************************************
	 *  VARIABLES
	 ****************************************************************************/
	public leftOpened: boolean = true;
	public rightOpened: boolean = true;

	public leftSideNavState: SideNavState = SideNavState.NONE;
	public rightSideNavState: SideNavState = SideNavState.NONE;

	public leftSideNavComponent: SideNavComponent = SideNavComponent.NONE;
	public rightSideNavComponent: SideNavComponent = SideNavComponent.NONE;


	/*****************************************************************************
	 *  MAIN
	 ****************************************************************************/
	constructor() {}

	public getSideNavState(): number {
		return 3 * this.leftSideNavState + this.rightSideNavState;
	}

	public leftClick() {
		this.leftSideNavState++;
		if (this.leftSideNavState > 2) this.leftSideNavState = 0;
	}

	public rightClick() {
		this.rightSideNavState++;
		if (this.rightSideNavState > 2) this.rightSideNavState = 0;
	}

	public setLeftNavState(state: SideNavState) {
		this.leftSideNavState = state;
	}

	public setRightNavState(state: SideNavState) {
		this.rightSideNavState = state;
	}

	public setLeftNavComponent(component: SideNavComponent) {
		this.leftSideNavComponent = component;
	}

	public setRightNavComponent(component: SideNavComponent) {
		this.rightSideNavComponent = component;
	}

	public routeLeftNav(component: string) {
		if(component === "table of content" && this.leftSideNavComponent === SideNavComponent.TABLE_OF_CONTENT) return true;
		else if(component === "content" && this.leftSideNavComponent === SideNavComponent.CONTENT_MENU) return true;
		else return false;
	}

	public routeRightNav(component: string) {
		if(component === "table of content" && this.rightSideNavComponent === SideNavComponent.TABLE_OF_CONTENT) return true;
		else if(component === "content" && this.rightSideNavComponent === SideNavComponent.CONTENT_MENU) return true;
		else return false;
	}
}
