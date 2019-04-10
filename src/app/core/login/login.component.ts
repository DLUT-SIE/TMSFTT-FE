import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { switchMap, filter, map } from 'rxjs/operators';
import { WindowService } from 'src/app/shared/services/window.service';

enum LoginStatus {
  VERIFYING_JWT = '正在检查您的登录状态...',
  REDIRECTING_TO_CAS = '正重定向到统一认证服务...',
  VERIFYING_CAS_TICKET = '正在检查您的登录凭证..',
  INVALID_CAS_TICKET = '您的登录凭证无效...',
  REDIRECTING_TO_HOME = '正重定向到主页...',
}

/**
 * LoginComponent presents status message for CAS authentication and JWT
 * authentication to users.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /** Make enum visible in template. */
  LoginStatus = LoginStatus;
  /** Current login status. */
  loginStatus = LoginStatus.VERIFYING_JWT;

  private nextURL: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly windowService: WindowService,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.verifyJWT().pipe(
      map((isValidJWT: boolean) => {
        const snapshot = this.activatedRoute.snapshot;
        this.nextURL = snapshot.queryParamMap.get('next') || '/dashboard';
        if (isValidJWT) {
          this.loginStatus = LoginStatus.REDIRECTING_TO_HOME;
          this.router.navigateByUrl(this.nextURL, { replaceUrl: true });
          return false;
        }
        return true;
      }),
      // If JWT in localStorage is valid, then do not proceed.
      filter((shouldContinue: boolean) => shouldContinue),
      map(() => {
        const snapshot = this.activatedRoute.snapshot;
        const ticket = snapshot.queryParamMap.get('ticket');
        const service = snapshot.queryParamMap.get('service');
        if (!ticket || !service) {
          this.loginStatus = LoginStatus.REDIRECTING_TO_CAS;
          this.authService.login();
          return {
            shouldContinue: false,
            ticket: '',
            service: '',
          };
        }
        return {
          shouldContinue: true,
          ticket,
          service,
        };
      }),
      // If no ticket or serviceURL, then user will be redirect and no need to proceed.
      filter(data => data.shouldContinue),
      // Send request to server to retrieve a JWT.
      switchMap(data => {
        this.loginStatus = LoginStatus.VERIFYING_CAS_TICKET;
        const ticket = data.ticket;
        const service = data.service;
        return this.authService.retrieveJWT(ticket, service);
      })
    ).subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.loginStatus = LoginStatus.INVALID_CAS_TICKET;
        this.authService.removeJWT();
        return;
      }
      this.loginStatus = LoginStatus.REDIRECTING_TO_HOME;
      this.router.navigate([this.nextURL], { replaceUrl: true });
    });
  }

  retryLogin() {
    this.windowService.redirect('/auth/login');
  }
}
