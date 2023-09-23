import { TestBed } from '@angular/core/testing';

import { AuthenticationServiceGuard } from './authentication-service.guard';

describe('AuthenticationServiceGuard', () => {
  let guard: AuthenticationServiceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthenticationServiceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
