import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/events/event.service';
import { Observable } from 'rxjs';
import { ChangeEvent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { UploadAdapter } from 'src/app/shared/services/upload-adapter';
import { AppInjector } from 'src/app/app.module';

@Component({
  selector: 'app-admin-campus-form',
  templateUrl: './admin-campus-form.component.html',
  styleUrls: ['./admin-campus-form.component.css']
})
export class AdminCampusFormComponent implements OnInit {
  editor = DecoupledEditor;
  editorConfig = {
    language: 'zh-cn',
    placeholder: '请提供校内培训活动的简要介绍 *',
    toolbar: {
      items: [
        'heading',
        '|', 'fontsize', 'fontfamily',
        '|', 'bold', 'italic', 'underline', 'strikethrough', 'highlight',
        '|', 'alignment',
        '|', 'bulletedList', 'numberedList',
        '|', 'link', 'blockQuote', 'imageUpload', 'insertTable', 'mediaEmbed',
        '|', 'undo', 'redo'
      ]
    },
    extraPlugins: [
      /** Provide upload adapter for CKEditor. */
      /* istanbul ignore next */
      (editor: CKEditor5.Editor) => {
        /* tslint:disable-next-line:no-any */
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
          return new UploadAdapter(loader, AppInjector.get(HttpClient));
        };
      }
    ]
  };
  programId: number;
  isUpdateMode = false;
  event: CampusEvent;

  eventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    time: ['', [Validators.required, Validators.maxLength(30)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    numHours: ['', [Validators.required]],
    numParticipants: ['', [Validators.required]],
    deadline: ['', [Validators.required, Validators.maxLength(30)]],
    description: ['', [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly eventService: EventService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.programId = queryParams.program_id;
    });

    if (this.route.snapshot.queryParams.event_id !== undefined) {
      this.isUpdateMode = true;
      const eventID = this.route.snapshot.queryParams.event_id;
      this.eventService.getEvent(eventID).subscribe(
        (event: CampusEvent) => {
          this.setEventValue(event);
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

  private setEventValue(event: CampusEvent) {
    this.event = event;
    this.name.setValue(this.event.name);
    this.time.setValue(this.event.time);
    this.location.setValue(this.event.location);
    this.numHours.setValue(this.event.num_hours);
    this.numParticipants.setValue(this.event.num_participants);
    this.deadline.setValue(this.event.deadline);
    this.description.setValue(this.event.description);
  }

  /* istanbul ignore next */
  onDescriptionEditorReady(editor: CKEditor5.Editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  descriptionChange(event: ChangeEvent) {
    if (event.editor) {
      this.description.setValue(event.editor.getData());
    }
  }

  /** 新增加的get函数 */
  get name() {
    return this.eventForm.get('name');
  }

  get time() {
    return this.eventForm.get('time');
  }

  get location() {
    return this.eventForm.get('location');
  }

  get numHours() {
    return this.eventForm.get('numHours');
  }

  get numParticipants() {
    return this.eventForm.get('numParticipants');
  }

  get deadline() {
    return this.eventForm.get('deadline');
  }

  get description() {
    return this.eventForm.get('description');
  }

  onSubmit() {
    const req: CampusEvent = {
      id: this.isUpdateMode ? this.event.id : undefined,
      program: this.programId,
      name: this.eventForm.value.name,
      time: this.eventForm.value.time,
      location: this.eventForm.value.location,
      num_hours: this.eventForm.value.numHours,
      num_participants: this.eventForm.value.numParticipants,
      deadline: this.eventForm.value.deadline,
      description: this.eventForm.value.description,
    };
    const targetEvent: Observable<CampusEvent> = this.isUpdateMode ?
                                             this.eventService.updateCampusEvent(req) :
                                             this.eventService.createCampusEvent(req);
    targetEvent.subscribe(
      event => {
        this.router.navigate(['/admin/events/', event.id]);
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
}
