import { Directive, Input, HostBinding } from '@angular/core'

@Directive({
    selector: 'img[default]',
    host: {
        '(error)': 'onError()',
        '(load)': 'load($event)',
        '[src]': 'src'
    }
})
export class ImagePreloadDirective {
    @Input() src: string;
    @Input() default: string;

    onError() {
        this.src = this.default;
    }

    load(event) {
        event.target.classList.add('image-loaded');
    }
}