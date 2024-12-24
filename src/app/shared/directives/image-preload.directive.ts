import { Directive, HostBinding, input, model } from '@angular/core'

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
    readonly src = model<string>();
    readonly default = input<string>();

    onError() {
        this.src.set(this.default());
    }

    load(event) {
        event.target.classList.add('image-loaded');
    }
}