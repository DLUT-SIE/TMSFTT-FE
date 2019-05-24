import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatPaginator, PageEvent } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, merge } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ReviewNoteService } from 'src/app/shared/services/records/review-note.service';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { OffCampusEvent } from 'src/app/shared/interfaces/event';
import { ContentType } from '../../enums/content-type.enum';

@Component({
  selector: 'app-off-campus-record-detail',
  templateUrl: './off-campus-record-detail.component.html',
  styleUrls: ['./off-campus-record-detail.component.css']
})
export class OffCampusRecordDetailComponent implements OnInit {
  readonly ContentType = ContentType;
  /** The data to be displayed. */
  @Input() record: {
    id?: number;
    create_time?: string;
    update_time?: string;
    off_campus_event?: OffCampusEvent;
    user?: number;
    status?: number;
    feedback?: number;
    attachments?: RecordAttachment[];
    contents?: RecordContent[];
    role: number;
    role_str?: string;
  };
  reviewNoteContent = '';
  reviewNotes: ReviewNote[] = [];
  reviewNotesLength = 0;
  isLoadingReviewNotes = true;
  readonly pageSize = environment.PAGINATION_SIZE;

  private forceRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    protected readonly reviewNoteService: ReviewNoteService,
    protected readonly snackBar: MatSnackBar,
  ) {}

  getReviewNotes(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('record', this.record.id);
    extraParams.set('user', this.record.user);
    return this.reviewNoteService.getReviewNotes({offset, limit, extraParams});
  }

  onSubmit() {
    if (this.reviewNoteContent.length === 0) {
      this.snackBar.open('请输入内容后再进行提交', '关闭', {duration: 3000});
      return;
    }
    this.reviewNoteService.createReviewNote(this.record, this.reviewNoteContent)
    .subscribe(() => {
      this.forceRefresh();
      },
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = '';
          for (const key of Object.keys(error.error)) {
            message += error.error[key].join(',');
          }
        }
        this.snackBar.open(message, '关闭');
      }
    );
  }

  ngOnInit() {
    merge(this.paginator.page, this.forceRefresh$).pipe(
      startWith({
        pageIndex: 0,
      }),
      map((event: PageEvent) => {
        this.isLoadingReviewNotes = true;
        return event.pageIndex;
      }),
      switchMap(page => {
        const offset = page * environment.PAGINATION_SIZE;
        return this.getReviewNotes(offset, environment.PAGINATION_SIZE);
      }),
      map(data => {
        this.reviewNotesLength = data.count;
        this.reviewNotes = data.results;
        return null;
      }),
    ).subscribe(() =>
      this.isLoadingReviewNotes = false,
      (error: HttpErrorResponse) => {
        let message = error.message;
        if (error.error) {
          message = '';
          for (const key of Object.keys(error.error)) {
            message += error.error[key].join(',') + '。';
          }
        }
        this.snackBar.open(message, '关闭');
      });
  }

  /** Trigger page refresh manually. */
  forceRefresh() {
    if (this.paginator.hasPreviousPage()) {
      // Not at first page. Jump to first page and content will be udpated
      // accordingly
      this.paginator.firstPage();
      return;
    }
    // At first page, just trigger content refresh
    this.forceRefresh$.next({
      pageIndex: 0,
    } as PageEvent);
  }

}
