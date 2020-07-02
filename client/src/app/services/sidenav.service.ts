import { Injectable } from '@angular/core';

export const NONE_WIDTH = 0;
export const RAIL_WIDTH = 50;
export const DRAWER_WIDTH = 250;

export enum SideNavState {
	NONE,
	RAIL,
	DRAWER
}

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  public leftSideNavState: SideNavState = SideNavState.NONE;
	public rightSideNavState: SideNavState = SideNavState.NONE;

	public leftOpened: boolean = false;
	public rightOpened: boolean = false;

  constructor() { }

  public getSideNavState(): number {
		return 3*this.leftSideNavState + this.rightSideNavState;
	}


	public leftClick() {
		this.leftSideNavState++;
		if(this.leftSideNavState > 2) this.leftSideNavState = 0;
	}

	public rightClick() {
		this.rightSideNavState++;
		if(this.rightSideNavState > 2) this.rightSideNavState = 0;
	}

}
