import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizacion]'
})
export class CapitalizacionDirective {

  constructor(private element: ElementRef) { }

  @HostListener('input',  ['$event']) onInput(event: Event):void{
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.toUpperCase();
  }
}
