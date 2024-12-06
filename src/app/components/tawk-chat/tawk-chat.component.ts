import {Component, inject, OnInit, Renderer2, input} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-tawk-chat',
    templateUrl: './tawk-chat.component.html',
    styleUrls: ['./tawk-chat.component.scss'],
    standalone: true
})
export class TawkChatComponent implements OnInit {

  private _renderer = inject(Renderer2);
  private _document = inject(DOCUMENT);

  readonly id = input<string>(environment.tawkto.id);
  public script: any;

  constructor() {
    this.script = this._renderer.createElement('script');
  }

  ngOnInit() {
    this.script.text = `var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/${this.id()}/default';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();`;

    this._renderer.appendChild(this._document.body, this.script);
  }

}
