import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { turnosGuard } from './turnos.guard';

describe('turnosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => turnosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
