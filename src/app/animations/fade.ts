import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('300ms', style({ opacity: 0 })),
  ]),
]);

export const delayedFadeAnimation = trigger('delayedFadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('2000ms ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('2000ms ease-in', style({ opacity: 0 })),
  ]),
]);