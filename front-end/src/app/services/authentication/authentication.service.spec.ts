import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtHelper: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return '';
          }
        }
      }), HttpClientTestingModule],
      providers: [
        JwtHelperService
      ]
    });

    jwtHelper = TestBed.get(JwtHelperService);
    service = TestBed.inject(AuthenticationService);
  });

  it('JWT & authentication service setup', () => {
    expect(service).toBeTruthy();
  });
});
