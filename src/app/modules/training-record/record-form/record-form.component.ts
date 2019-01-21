import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { RecordService } from 'src/app/services/training-record/record.service';
import { AuthService, AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { OffCampusEventRequest } from 'src/app/interfaces/event';
import { RecordContent } from 'src/app/interfaces/record';
import { ContentType } from 'src/app/enums/content-type.enum';

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
    name: ['', Validators.required],
    time: ['', Validators.required],
    location: ['', Validators.required],
    numHours: ['', Validators.required],
    numParticipants: ['', Validators.required],
    content: [''],
    summary: [''],
    feedback: [''],
    files: this.fb.array([]),
  });

  /** The attachments to be uploaded. */
  attachments: File[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly recordService: RecordService,
  ) { }

  ngOnInit() {
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

  onSubmit() {
    const value = this.recordForm.value;
    const offCampusEvent: OffCampusEventRequest = {
      name: value.name,
      time: value.time,
      location: value.location,
      num_hours: value.numHours,
      num_participants: value.numParticipants,
    };
    // We only submit non-empty content.
    const contents: RecordContent[] = [
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
    const attachments: File[] = this.attachments;
    this.recordService.createOffCampusEventRecord(
      offCampusEvent, this.authService.userID,
      contents, attachments).subscribe(record => {
        if (record !== null) {
          this.router.navigate(['../record-detail/', record.id]);
          return;
        }
        // TODO(youchen): Notify user that the process failed.
      });
  }

  /** Push a new FormControl to FormArray, this supports multi files uploading. */
  addFile() {
    this.files.push(this.fb.control(null));
  }
}
