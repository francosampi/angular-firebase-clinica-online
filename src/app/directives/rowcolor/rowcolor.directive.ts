import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRowColor]'
})
export class RowColorDirective {
  @Input() set appRowColor(condition: boolean) {
    if (condition) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'lightblue');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }
}