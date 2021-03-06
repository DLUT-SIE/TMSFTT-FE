import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { RecordService } from '../../../../../shared/services/records/record.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { OffCampusEvent } from 'src/app/shared/interfaces/event';
import { Record } from 'src/app/shared/interfaces/record';
import { MatSnackBar, MatAutocompleteSelectedEvent, MatAutocomplete, MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { switchMap, map, debounceTime } from 'rxjs/operators';
import { ContentType } from 'src/app/shared/enums/content-type.enum';
import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { EventService } from 'src/app/shared/services/events/event.service';
import { RecordAttachment, SecuredPath } from 'src/app/shared/interfaces/record-attachment';
import { RecordAttachmentService } from 'src/app/shared/services/records/record-attachment.service';
import { RoleChoice } from 'src/app/shared/interfaces/event-role-choices';
import { errorProcess } from 'src/app/shared/utils/error-process';
import { DateTimePickerDialogComponent } from 'src/app/shared/components/date-time-picker-dialog/date-time-picker-dialog.component';
import { PlatformService } from 'src/app/shared/services/platform.service';

interface FileChangeEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

/** RecordFormComponent provides Record form and handle creation logic. */
@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.css']
})
export class RecordFormComponent implements OnInit {
  /** Use FormBuilder to build our form to collect Record data. */
  roleChoices: RoleChoice[] = [];

  recordForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    time: ['', [Validators.required, Validators.maxLength(30)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    numHours: ['', [Validators.required]],
    numParticipants: ['', [Validators.required]],
    role: ['', [Validators.required]],
    content: ['', [Validators.required, Validators.maxLength(200)]],
    summary: ['', [Validators.maxLength(200)]],
    feedback: ['', [Validators.maxLength(200)]],
    files: this.fb.array([]),
  });

  @ViewChild(MatAutocomplete) autoComplete: MatAutocomplete;
  filteredOptions: Observable<OffCampusEvent[]>;

  /** The attachments to be uploaded. */
  attachments: File[] = [];
  record: Record;
  originalAttachments: Array<{id: number, path: SecuredPath}> = [];
  hasOriginalAttachments = false;
  isUpdateMode: boolean;
  isLoading = false;

  constructor(
    readonly urlLocation: Location,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly recordService: RecordService,
    private readonly eventService: EventService,
    private readonly recordAttachmentService: RecordAttachmentService,
    private readonly platformService: PlatformService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit() {
    // Retrieve auto-complete options.
    this.filteredOptions = this.name.valueChanges.pipe(
      debounceTime(1000),
      switchMap(prefix => this._filter(prefix)),
      map((value: PaginatedResponse<OffCampusEvent>) => value.results),
    );

    // Update form when the auto-complete option is selected.
    this.autoComplete.optionSelected.subscribe((event: MatAutocompleteSelectedEvent) => {
      const offCampusEvent = event.option.value as OffCampusEvent;
      this.name.setValue(offCampusEvent.name);
      this.time.setValue(offCampusEvent.time);
      this.location.setValue(offCampusEvent.location);
      this.numHours.setValue(offCampusEvent.num_hours);
      this.numParticipants.setValue(offCampusEvent.num_participants);
    });

    this.recordService.getRoleChoices().subscribe(roleChoices => {
      this.roleChoices = roleChoices;
    });

    if (this.route.snapshot.queryParams.record_id !== undefined) {
      const recordID = this.route.snapshot.queryParams.record_id;
      this.recordService.getRecordWithDetail(recordID).subscribe(
        (record: Record) => {
          this.isUpdateMode = true;
          this.setRecordValue(record);
        },
        (error: HttpErrorResponse) => {
          const message = errorProcess(error);
          this.snackBar.open(message, '关闭');
        });
    }
  }

  /**
   * Invoke event service to retrieve filtered off-campus events
   * based on given name prefix.
   */
  private _filter(prefix: string) {
    const params = new Map<string, {}>([['name__startswith', prefix]]);
    return this.eventService.getOffCampusEvents({ extraParams: params });
  }

  private setRecordValue(record: Record) {
    this.record = record;
    this.record.off_campus_event = record.off_campus_event as OffCampusEvent;
    this.name.setValue(this.record.off_campus_event.name);
    this.time.setValue(this.record.off_campus_event.time);
    this.location.setValue(this.record.off_campus_event.location);
    this.numHours.setValue(this.record.off_campus_event.num_hours);
    this.numParticipants.setValue(this.record.off_campus_event.num_participants);
    this.role.setValue(this.record.role);
    this.record.contents = record.contents as RecordContent[];
    this.record.contents.map(content => {
      switch (content.content_type) {
        case ContentType.CONTENT_TYPE_SUMMARY: {
          this.summary.setValue(content.content);
          break;
        }
        case ContentType.CONTENT_TYPE_CONTENT: {
          this.content.setValue(content.content);
          break;
        }
        default: {
          this.feedback.setValue(content.content);
          break;
        }
      }
    });
    if ((record.attachments as RecordAttachment[]).length !== 0) {
      (record.attachments as RecordAttachment[]).map(attachment => {
        this.originalAttachments.push({id: attachment.id, path: attachment.path as SecuredPath});
      });
      this.hasOriginalAttachments = true;
    }
  }

  /** Access the name field of the form. */
  get name() {
    return this.recordForm.get('name');
  }

  /** Access the time field of the form. */
  get time() {
    return this.recordForm.get('time');
  }

  /** Access the location field of the form. */
  get location() {
    return this.recordForm.get('location');
  }

  /** Access the numHours field of the form. */
  get numHours() {
    return this.recordForm.get('numHours');
  }

  /** Access the numParticipants field of the form. */
  get numParticipants() {
    return this.recordForm.get('numParticipants');
  }

  get role() {
    return this.recordForm.get('role');
  }

  /** Access the content field of the form. */
  get content() {
    return this.recordForm.get('content');
  }

  /** Access the summary field of the form. */
  get summary() {
    return this.recordForm.get('summary');
  }

  /** Access the feedback field of the form. */
  get feedback() {
    return this.recordForm.get('feedback');
  }

  /** Access the files field of the form. */
  get files() {
    return this.recordForm.get('files') as FormArray;
  }

  /** Append file to attachments when encountered a change event. */
  onFileAdd(event: FileChangeEvent) {
    if (!event.target.files || event.target.files.length === 0) return;
    this.attachments.push(event.target.files[0]);
  }

  /** When user clicks remove button, remove file stored. */
  onFileRemove(i: number) {
    this.files.removeAt(i);
    this.attachments.splice(i, 1);
  }

  private buildContents(): RecordContent[] {
    const value = this.recordForm.value;
    return [
      {
        content_type: ContentType.CONTENT_TYPE_CONTENT,
        content: value.content,
      },
      {
        content_type: ContentType.CONTENT_TYPE_SUMMARY,
        content: value.summary,
      },
      {
        content_type: ContentType.CONTENT_TYPE_FEEDBACK,
        content: value.feedback,
      },
    ].filter((val) => val.content !== '');
  }

  private buildOffCampusEventToCreate(): OffCampusEvent {
    const value = this.recordForm.value;
    return {
      name: value.name,
      time: value.time,
      location: value.location,
      num_hours: value.numHours,
      num_participants: value.numParticipants,
    };
  }

  private buildOffCampusEventToUpdate(): OffCampusEvent {
    const value = this.recordForm.value;
    const offCampusEvent = this.record.off_campus_event as OffCampusEvent;
    return {
      id: offCampusEvent.id,
      name: value.name,
      time: value.time,
      location: value.location,
      num_hours: value.numHours,
      num_participants: value.numParticipants,
    };
  }

  private buildRequest(): Record {
    return {
      id: this.isUpdateMode ? this.record.id : undefined,
      off_campus_event: this.isUpdateMode ?
                        this.buildOffCampusEventToUpdate() :
                        this.buildOffCampusEventToCreate(),
      user: this.authService.userID,
      contents: this.buildContents(),
      attachments: this.attachments,
      role: this.recordForm.value.role,
    };
  }

  onSubmit() {
    this.isLoading = true;
    const req: Record = this.buildRequest();
    const targetRecord: Observable<Record> = this.isUpdateMode ?
                                           this.recordService.updateOffCampusRecord(req) :
                                           this.recordService.createOffCampusRecord(req);
    targetRecord.subscribe(
      record => {
        this.router.navigate(['user/off-campus-event-records/', record.id]);
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
        this.isLoading = false;
      });
  }

  /** Push a new FormControl to FormArray, this supports multi files uploading. */
  addFile() {
    this.files.push(this.fb.control(null));
  }

  deleteAttachment(attachment: {id: number, path: SecuredPath}) {
    return this.recordAttachmentService.deleteRecordAttachment(attachment.id).subscribe(
      () => {
        this.originalAttachments = this.originalAttachments.filter(item => item.id !== attachment.id);
        this.snackBar.open('删除成功。', '关闭');
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
      }
    );
  }

  selectDateTimeForControl(control: AbstractControl): void {
    const dialogRef = this.dialog.open(DateTimePickerDialogComponent, {
      width: this.platformService.isMobile ? '100%' : '500px',
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      control.setValue(result);
    });
  }


}
