/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output
} from "@angular/core";
import {Point} from "../popover/popover";

const menuPositions: string[] = [
        "bottom-left",
        "bottom-right",
        "top-left",
        "top-right",
        "left-bottom",
        "left-top",
        "right-bottom",
        "right-top"
    ];

// TODO: the ng-content inside the dropdown-menu should ideally just be
// <ng-content select="clr-dropdown-menu"></ng-content>. Remove .dropdown-menu in 1.0?
@Component({
    selector: "clr-dropdown",
    template: `
        <ng-content select="[clrDropdownToggle]"></ng-content>
        <div class="dropdown-menu" *clrPopover="open; anchor: anchor; anchorPoint: anchorPoint; 
            popoverPoint: popoverPoint;">
            <ng-content select="[clr-dropdown-menu, .dropdown-menu]"></ng-content> 
        </div>
    `,
    host: {
        "[class.dropdown]" : "true",
        "[class.open]" : "true" // always set to true; clrPopover will remove it from DOM when not open
    }
})
export class Dropdown {

    @Input("clrDropdownMenuOpen") _open: boolean = false;

    @Output("clrDropdownMenuOpenChange") _openChanged: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    @Input("clrCloseMenuOnItemClick") isMenuClosable: boolean = true;

    private _menuPosition: string;
    public anchorPoint: Point = Point.BOTTOM_LEFT; // default if menuPosition isn't set
    public popoverPoint: Point = Point.LEFT_TOP; // default if menuPosition isn't set
    public anchor: any; // host element is the anchor

    constructor(public elementRef: ElementRef) {
        this.anchor = elementRef.nativeElement;
    }

    @Input("clrMenuPosition")
    set menuPosition(pos: string) {
        if (pos && (menuPositions.indexOf(pos) > -1)) {
            this._menuPosition = pos;
        } else {
            this._menuPosition = "bottom-left";
        }
        // set the popover values based on menu position
        switch (this._menuPosition) {
            case ("top-right"):
                this.anchorPoint = Point.TOP_RIGHT;
                this.popoverPoint = Point.RIGHT_BOTTOM;
                break;
            case ("top-left"):
                this.anchorPoint = Point.TOP_LEFT;
                this.popoverPoint = Point.LEFT_BOTTOM;
                break;
            case ("bottom-right"):
                this.anchorPoint = Point.BOTTOM_RIGHT;
                this.popoverPoint = Point.RIGHT_TOP;
                break;
            case ("bottom-left"):
                this.anchorPoint = Point.BOTTOM_LEFT;
                this.popoverPoint = Point.LEFT_TOP;
                break;
            case ("right-top"):
                this.anchorPoint = Point.RIGHT_TOP;
                this.popoverPoint = Point.LEFT_TOP;
                break;
            case ("right-bottom"):
                this.anchorPoint = Point.RIGHT_BOTTOM;
                this.popoverPoint = Point.LEFT_BOTTOM;
                break;
            case ("left-top"):
                this.anchorPoint = Point.LEFT_TOP;
                this.popoverPoint = Point.RIGHT_TOP;
                break;
            case ("left-bottom"):
                this.anchorPoint = Point.LEFT_BOTTOM;
                this.popoverPoint = Point.RIGHT_BOTTOM;
                break;
            default:
                this.anchorPoint = Point.BOTTOM_LEFT;
                this.popoverPoint = Point.LEFT_TOP;
                break;
        }
    }

    toggleDropdown(): void {
        this.open = !this.open;
    }

    get open(): boolean {
        return this._open;
    }

    set open(val: boolean) {
        this._open = val;
        this._openChanged.emit(val);
    }

    //called on mouse clicks anywhere in the DOM.
    //Checks to see if the mouseclick happened on the host or outside
    @HostListener("document:click", ["$event.target"])
    onMouseClick(target: any): void {
        if (this._open) {
            let current: any = target; //Get the element in the DOM on which the mouse was clicked
            let dropdownHost: any = this.elementRef.nativeElement; //Get the current dropdown native HTML element

            //Start checking if current and dropdownHost are equal. If not traverse to the parentNode and check again.
            while (current) {
                if (current === dropdownHost) {
                    return;
                }
                current = current.parentNode;
            }
            this._open = false; //Remove .open from the dropdown
        }
    }
}
