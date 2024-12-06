/**
 * Code taken from the source of ngx-print (https://github.com/selemxmn/ngx-print)
 * and modified to support printing canvas content as per solution provided under
 * this issue: https://github.com/selemxmn/ngx-print/issues/105
 */
import { Directive, HostListener, Input, input } from '@angular/core';

@Directive({
    selector: "[ngPrintContent]",
    standalone: true
})
export class PrintContentDirective {

  public _printStyle = [];

  /**
   * Prevents the print dialog from opening on the window
   *
   * @memberof PrintContentDirective
   */
  readonly previewOnly = input<boolean>(false);

  /**
   *
   *
   * @memberof PrintContentDirective
   */
  readonly printSectionId = input<string>(undefined);

  /**
   *
   *
   * @memberof PrintContentDirective
   */
  readonly printTitle = input<string>(undefined);

  /**
   *
   *
   * @memberof PrintContentDirective
   */
  readonly useExistingCss = input(false);

  /**
   * A delay in milliseconds to force the print dialog to wait before opened. Default: 0
   *
   * @memberof PrintContentDirective
   */
  readonly printDelay = input<number>(0);

  /**
   *
   *
   * @memberof PrintContentDirective
   */
  @Input()
  set printStyle(values: { [key: string]: { [key: string]: string } }) {
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
      this._printStyle.push((key + JSON.stringify(values[key])).replace(/['"]+/g, ''));
      }
    }
    this.returnStyleValues();
  }

/**
 *
 *
 * @returns the string that create the stylesheet which will be injected
 * later within <style></style> tag.
 *
 * -join/replace to transform an array objects to css-styled string
 *
 * @memberof PrintContentDirective
 */
public returnStyleValues() {
  return `<style> ${this._printStyle.join(' ').replace(/,/g,';')} </style>`;
  }

  /**
   *
   *
   * @returns html for the given tag
   *
   * @memberof PrintContentDirective
   */
  private _styleSheetFile = '';

  /**
   * @memberof PrintContentDirective
   * @param cssList
   */
  @Input()
  set styleSheetFile(cssList: string) {
    let linkTagFn = function(cssFileName) {
      return `<link rel="stylesheet" type="text/css" href="${cssFileName}">`;
    }
    if (cssList.indexOf(',') !== -1) {
      const valueArr = cssList.split(',');
      for (let val of valueArr) {
        this._styleSheetFile = this._styleSheetFile + linkTagFn(val);
      }
    } else {
      this._styleSheetFile = linkTagFn(cssList);
    }
  }

  /**
   * @returns string which contains the link tags containing the css which will
   * be injected later within <head></head> tag.
   *
   */
  private returnStyleSheetLinkTags() {
    return this._styleSheetFile;
  }
  private getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements = document.getElementsByTagName(tag);
    for (let index = 0; index < elements.length; index++) {
      html.push(elements[index].outerHTML);
    }
    return html.join('\r\n');
  }

    /**
   *
   * @description When printing, the default option of form elements are printed.
   * Here we update what that default is to print the current values.
   *
   * @param elements the html element collection to save defaults to
   *
   */
  private updateInputDefaults(elements: HTMLCollectionOf<HTMLInputElement>): void {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element['defaultValue'] = element.value;
      if (element['checked']) element['defaultChecked'] = true;
    }
  }
  private updateSelectDefaults(elements: HTMLCollectionOf<HTMLSelectElement>): void {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const selectedIdx = element.selectedIndex;
      const selectedOption: HTMLOptionElement = element.options[selectedIdx];

      selectedOption.defaultSelected = true;
    }
  }
  private updateTextAreaDefaults(elements: HTMLCollectionOf<HTMLTextAreaElement>): void {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element['defaultValue'] = element.value;
    }
  }

  /**
   * @description Retrieves the html contents of the print section id.
   * Updates the html elements to default their form values to the current form values
   *
   * @returns {string | null} html section to be printed
   *
   */
  private getHtmlContents(): string | null {
    const printContents = document.getElementById(this.printSectionId());
    if (!printContents) return null;

    const inputEls = printContents.getElementsByTagName('input');
    const selectEls = printContents.getElementsByTagName('select');
    const textAreaEls = printContents.getElementsByTagName('textarea');

    this.updateInputDefaults(inputEls);
    this.updateSelectDefaults(selectEls);
    this.updateTextAreaDefaults(textAreaEls);

    const canvas = Array.from(document.getElementsByTagName('canvas'));
    const canvasClone = Array.from(printContents.getElementsByTagName('canvas'))

    for (var i = 0; i < canvas.length; i++) {
      const e = canvas[i];
      const eClone = canvasClone[i];
      const img = document.createElement('img');
      img.className = e.className;
      img.style.cssText = e.getAttribute('style');
      img.src = e.toDataURL();
      eClone.parentNode.replaceChild(img, eClone);
    };

    return printContents.innerHTML;
  }

  /**
   *
   *
   * @memberof PrintContentDirective
   */
  @HostListener('click')
  public print(): void {
    let printContents, popupWin, styles = '', links = '';
    const baseTag = this.getElementTag('base');

    if(this.useExistingCss()) {
      styles = this.getElementTag('style');
      links = this.getElementTag('link');
    }

    printContents = this.getHtmlContents();
    popupWin = window.open("", "_blank", "top=0,left=0,height=auto,width=auto");
    popupWin.document.open();
    const printTitle = this.printTitle();
    popupWin.document.write(`
      <html>
        <head>
          <title>${printTitle ? printTitle : ""}</title>
          ${baseTag}
          ${this.returnStyleValues()}
          ${this.returnStyleSheetLinkTags()}
          ${styles}
          ${links}
        </head>
        <body>
          ${printContents}
          <script defer>
            function triggerPrint(event) {
              window.removeEventListener('load', triggerPrint, false);
              ${this.previewOnly() ? '' : `setTimeout(function() {
                closeWindow(window.print());
              }, ${this.printDelay()});`}
            }
            function closeWindow(){
                window.close();
            }
            window.addEventListener('load', triggerPrint, false);
          </script>
        </body>
      </html>`);
    popupWin.document.close();
  }
}
