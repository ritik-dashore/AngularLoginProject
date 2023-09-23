import { TestBed } from '@angular/core/testing';

import { LoginSystemService } from './login-system.service';

describe('LoginSystemService', () => {
  let service: LoginSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
