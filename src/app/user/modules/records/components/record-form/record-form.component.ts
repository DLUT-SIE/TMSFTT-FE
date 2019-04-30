import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { RecordService } from '../../../../../shared/services/records/record.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { OffCampusEvent } from 'src/app/shared/interfaces/event';
import { Record } from 'src/app/shared/interfaces/record';
import { MatSnackBar, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { switchMap, map, debounceTime } from 'rxjs/operators';
import { ContentType } from 'src/app/shared/enums/content-type.enum';
import { RecordContent } from 'src/app/shared/interfaces/record-content';
import { EventService } from 'src/app/shared/services/events/event.service';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { RecordAttachmentService } from 'src/app/shared/services/records/record-attachment.service';

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
  recordForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    time: ['', [Validators.required, Validators.maxLength(30)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    numHours: ['', [Validators.required]],
    numParticipants: ['', [Validators.required]],
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
  originalAttachments: RecordAttachment[] = [];
  hasOriginalAttachments = false;
  isUpdateMode: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly recordService: RecordService,
    private readonly eventService: EventService,
    private readonly recordAttachmentService: RecordAttachmentService,
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
    if (this.route.snapshot.queryParams.record_id !== undefined) {
      const recordID = this.route.snapshot.queryParams.record_id;
      this.recordService.getRecordWithDetail(recordID).subscribe(
        (record: Record) => {
          this.isUpdateMode = true;
          this.setRecordValue(record);
        },
        (error: HttpErrorResponse) => {
          let message = error.message;
          if (error.error) {
            message = error.error['detail'] + '。';
          }
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
    if (record.attachments.length !== 0) {
      this.originalAttachments = record.attachments as RecordAttachment[];
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
    };
  }

  onSubmit() {
    const req: Record = this.buildRequest();
    const targetRecord: Observable<Record> = this.isUpdateMode ?
                                           this.recordService.updateOffCampusRecord(req) :
                                           this.recordService.createOffCampusRecord(req);
    targetRecord.subscribe(
      record => {
        this.router.navigate(['user/off-campus-event-records/', record.id]);
      },
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

  /** Push a new FormControl to FormArray, this supports multi files uploading. */
  addFile() {
    this.files.push(this.fb.control(null));
  }

  deleteAttachment(attachment: RecordAttachment) {
    return this.recordAttachmentService.deleteRecordAttachment(attachment.id).subscribe(
      () => {
        this.originalAttachments = this.originalAttachments.filter(item => item.id !== attachment.id);
      }
    );

  }
}
