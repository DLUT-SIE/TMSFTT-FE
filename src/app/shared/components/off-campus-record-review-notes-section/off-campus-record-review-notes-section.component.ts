import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PageEvent, MatPaginator, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, merge } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';

import { Record } from 'src/app/shared/interfaces/record';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { ReviewNoteService } from 'src/app/shared/services/records/review-note.service';
import { errorProcess } from '../../utils/error-process';

@Component({
  selector: 'app-off-campus-record-review-notes-section',
  templateUrl: './off-campus-record-review-notes-section.component.html',
  styleUrls: ['./off-campus-record-review-notes-section.component.css']
})
export class OffCampusRecordReviewNotesSectionComponent implements OnInit {
  @Input() record: Record;
  reviewNoteContent = '';
  reviewNotes: ReviewNote[] = [];
  reviewNotesLength = 0;
  isLoadingReviewNotes = true;
  readonly pageSize = 5;

  private forceRefresh$ = new Subject<PageEvent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    protected readonly reviewNoteService: ReviewNoteService,
    protected readonly snackBar: MatSnackBar,
  ) { }

  getReviewNotes(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('record', this.record.id);
    return this.reviewNoteService.getReviewNotes({offset, limit, extraParams});
  }

  onSubmit() {
    if (this.reviewNoteContent.length === 0) {
      this.snackBar.open('请输入内容后再进行提交', '关闭', {duration: 3000});
      return;
    }
    this.reviewNoteService.createReviewNote(this.record, this.reviewNoteContent)
    .subscribe(() => {
      this.reviewNoteContent = '';
      this.forceRefresh();
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
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
        const offset = page * this.pageSize;
        return this.getReviewNotes(offset, this.pageSize);
      }),
      map(data => {
        this.reviewNotesLength = data.count;
        this.reviewNotes = data.results;
        return null;
      }),
    ).subscribe(() => {
      this.isLoadingReviewNotes = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.isLoadingReviewNotes = false;
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
