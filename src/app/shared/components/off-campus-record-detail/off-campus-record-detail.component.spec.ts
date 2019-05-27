import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  MatPaginatorModule,
  MatIconModule,
  MatDividerModule,
  MatFormFieldModule,
  MatSnackBar,
  MatInputModule,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { OffCampusRecordDetailComponent } from './off-campus-record-detail.component';
import { ReviewNoteService } from 'src/app/shared/services/records/review-note.service';
import { ReviewNote } from 'src/app/shared/interfaces/review-note';
import { Location } from '@angular/common';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';
import { AsSecuredPathPipe } from 'src/app/shared/pipes/as-secured-path.pipe';

describe('OffCampusRecordDetailComponent', () => {
  let component: OffCampusRecordDetailComponent;
  let fixture: ComponentFixture<OffCampusRecordDetailComponent>;
  let getReviewNotes: jasmine.Spy;
  let getReviewNotes$: Subject<PaginatedResponse<ReviewNote>>;
  let createReviewNote$: Subject<ReviewNote>;
  let snackBarOpen: jasmine.Spy;
  const dummyReviewNote = { id: 1 };

  beforeEach(async(() => {
    getReviewNotes = jasmine.createSpy();
    getReviewNotes$ = new Subject();
    createReviewNote$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        OffCampusRecordDetailComponent,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
        AsSecuredPathPipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatDividerModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
          }
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: ReviewNoteService,
          useValue: {
            getReviewNotes: () => getReviewNotes$,
            createReviewNote: () => createReviewNote$,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusRecordDetailComponent);
    component = fixture.componentInstance;
    const record = {
      id: 1,
      create_time: '2019-01-01',
      update_time: '2019-01-02',
      campus_event: null,
      off_campus_event: {
        id: 1,
        create_time: '2019-03-02T09:07:57.159755+08:00',
        update_time: '2019-03-02T09:07:57.159921+08:00',
        name: 'sfdg',
        time: '2019-03-02T00:00:00+08:00',
        location: 'dfgfd',
        num_hours: 0,
        num_participants: 25
        },
      contents: [],
      attachments: [],
      user: 1,
      status: 1,
      role: 1,
      role_str: '1433223',
    };
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get reviewnotes', () => {
    getReviewNotes = spyOn(component, 'getReviewNotes');
    getReviewNotes.and.returnValue(getReviewNotes$);

    expect(component.getReviewNotes(10, 0)).toBe(getReviewNotes$);
  });

  it('should create reviewnote.', () => {
    component.reviewNoteContent = 'abc';
    const forceRefresh = spyOn(component, 'forceRefresh');

    component.onSubmit();

    createReviewNote$.next();

    expect(forceRefresh).toHaveBeenCalled();

    component.reviewNoteContent = '';
    component.onSubmit();

    expect(snackBarOpen).toHaveBeenCalledWith('请输入内容后再进行提交', '关闭', {duration: 3000});
  });

  it('should trigger refresh (at first page)', () => {
    const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
    const firstPage = spyOn(component.paginator, 'firstPage');
    hasPreviousPage.and.returnValue(true);
    component.forceRefresh();

    expect(hasPreviousPage).toHaveBeenCalled();
    expect(firstPage).toHaveBeenCalled();
  });

  it('should trigger refresh (not at first page)', () => {
    const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
    const firstPage = spyOn(component.paginator, 'firstPage');
    hasPreviousPage.and.returnValue(false);
    component.forceRefresh();

    expect(hasPreviousPage).toHaveBeenCalled();
    expect(firstPage).not.toHaveBeenCalled();
  });

  it('should display errors when creation failed.', () => {
    component.reviewNoteContent = 'abc';
    createReviewNote$.error({
      message: 'Raw error message',
      error: {
        reviewnotecontent_data: ['Invalid content'],
      },
    } as HttpErrorResponse);

    component.onSubmit();

    expect(snackBarOpen).toHaveBeenCalledWith('Invalid content', '关闭');
  });

  it('should display raw errors when creation failed.', () => {
    component.reviewNoteContent = 'abc';
    createReviewNote$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    component.onSubmit();

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

  it('should load data', () => {
    const results = [dummyReviewNote, dummyReviewNote, dummyReviewNote];
    getReviewNotes$.next({
      results,
      count: 100,
      previous: '',
      next: ''
    });

    expect(component.isLoadingReviewNotes).toBeFalsy();
    expect(component.reviewNotes).toEqual(results);
    expect(component.reviewNotesLength).toEqual(100);
  });

  it('should display errors when getting reviewnotes failed.', () => {
    getReviewNotes$.error({
      message: 'Raw error message',
      error: {
        reviewnotes_data: ['Rejected'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Rejected。', '关闭');
  });

  it('should display raw errors when getting reviewnotes failed.', () => {
    getReviewNotes$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

});
