import { Directive, HostBinding, input } from '@angular/core'

@Directive({
    selector: 'img[default]',
    host: {
        '(error)': 'onError()',
        '(load)': 'load($event)',
        '[src]': 'src()'
    },
    standalone: true
})
export class ImagePreloadDirective {
    readonly src = input<string>(undefined);
    readonly default = input<string>(undefined);

    onError() {
        this.src = this.default();
    }

    load(event) {
        event.target.classList.add('image-loaded');
    }
}