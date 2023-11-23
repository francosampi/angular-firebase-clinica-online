import { trigger, transition, style, animate } from '@angular/animations';

export const slideInAnimation = trigger('slideInAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('750ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('750ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })),
  ]),
]);
