import { Injectable } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';


/** This is a mapping definition of backend server. */
export interface Notification {
  time: string;
  sender: string;
  recipient: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /** Dummy notifications */
  notes: Notification[] = [
    {
      time: '2019-01-01',
      sender: 'David',
      recipient: 'Sam',
      content: '这是一则系统发出的通知，且这是一则长度很长的通知，因此我们需要调整该通知\
      在不同组件下的表示形式以提供较为良好的观感。',
    },
    {
      time: '2019-01-02',
      sender: 'David',
      recipient: 'Sam',
      content: 'This is another notification.'
    },
    {
      time: '2019-01-03',
      sender: 'David',
      recipient: 'Sam',
      content: 'How are you today?'
    },
    {
      time: '2019-01-01',
      sender: 'David',
      recipient: 'Sam',
      content: '这是一则系统发出的通知，且这是一则长度很长的通知，因此我们需要调整该通知\
      在不同组件下的表示形式以提供较为良好的观感。',
    },
    {
      time: '2019-01-02',
      sender: 'David',
      recipient: 'Sam',
      content: 'This is another notification.'
    },
    {
      time: '2019-01-03',
      sender: 'David',
      recipient: 'Sam',
      content: 'How are you today?'
    },

  ];

  private LIMIT = 20;
  /** How often should we query latest notifications. */
  private REFRESH_INTERVAL = 30 * 1000;

  /** Yield latest unread notifications. */
  latestUnreadNotifications$: Observable<Notification[]>;

  constructor(
    private readonly http: HttpClient,
  ) {
    this.latestUnreadNotifications$ = timer(0, this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.getNotifications(0, this.LIMIT, false)),
      shareReplay(1),
    );
  }

  getNotifications(offset?: number, limit?: number,
                   readStatus?: boolean): Observable<Notification[]> {
    if (offset === undefined) offset = 0;
    if (limit === undefined) limit = this.LIMIT;
    const paramsObj = { offset, limit };
    const queryParams = Object.keys(paramsObj).map(
      key => key + '=' + encodeURIComponent(paramsObj[key])).join('&');
    let url = environment.NOTIFICATION_SERVICE_URL;
    if (readStatus !== undefined) {
      url += readStatus ? 'read-notifications/' : 'unread-notifications/';
    }
    url += '?' + queryParams;
    return this.http.get<Notification[]>(url);
  }
}
