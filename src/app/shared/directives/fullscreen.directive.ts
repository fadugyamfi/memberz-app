import { Directive, HostListener } from '@angular/core';
declare var require: any
import screenfull from 'screenfull';
@Directive({
	selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {
	@HostListener('click') onClick() {
		if (screenfull.isEnabled) {
			screenfull.toggle();
		}
	}
}
