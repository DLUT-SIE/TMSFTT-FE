import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, AUTH_SERVICE } from '../services/auth/auth-service';
import { switchMap, filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum LoginStatus {
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
export class LoginComponent implements OnInit, OnDestroy {
  LoginStatus = LoginStatus;
  loginStatus = LoginStatus.VERIFYING_JWT;

  private readonly destroyed = new Subject();
  private nextURL: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService) { }

  ngOnInit() {
    this.authService.verifyJWT().pipe(
      takeUntil(this.destroyed),
      map((isValidJWT: boolean) => {
        const snapshot = this.activatedRoute.snapshot;
        this.nextURL = snapshot.queryParamMap.get('next') || '/home';
        if (isValidJWT) {
          this.loginStatus = LoginStatus.REDIRECTING_TO_HOME;
          this.router.navigate([this.nextURL]);
          return false;
        }
        return true;
      }),
      // If JWT in localStorage is valid, then do not proceed.
      filter((shouldContinue: boolean) => shouldContinue),
      map(() => {
        const snapshot = this.activatedRoute.snapshot;
        const ticket = snapshot.queryParamMap.get('ticket');
        const serviceURL = snapshot.queryParamMap.get('service_url');
        if (!ticket || !serviceURL) {
          this.loginStatus = LoginStatus.REDIRECTING_TO_CAS;
          this.authService.login();
          return {
            shouldContinue: false,
            ticket: '',
            serviceURL: '',
          };
        }
        return {
          shouldContinue: true,
          ticket,
          serviceURL,
        };
      }),
      // If no ticket or serviceURL, then user will be redirect and no need to proceed.
      filter(data => data.shouldContinue),
      // Send request to server to retrieve a JWT.
      switchMap(data => {
        this.loginStatus = LoginStatus.VERIFYING_CAS_TICKET;
        const ticket = data.ticket;
        const serviceURL = data.serviceURL;
        return this.authService.retrieveJWT(ticket, serviceURL);
      })
    ).subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.loginStatus = LoginStatus.INVALID_CAS_TICKET;
        return;
      }
      this.loginStatus = LoginStatus.REDIRECTING_TO_HOME;
      this.router.navigate([this.nextURL]);
    });
  }

  /** Unsubscribe all subscriptions. */
  ngOnDestroy() {
    this.destroyed.next();
  }
}
