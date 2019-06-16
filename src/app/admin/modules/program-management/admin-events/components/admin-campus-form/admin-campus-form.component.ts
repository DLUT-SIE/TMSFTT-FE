import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import { Location } from '@angular/common';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { CampusEvent } from 'src/app/shared/interfaces/event';
import { RoundChoice } from 'src/app/shared/interfaces/round-choice';
import { EventService } from 'src/app/shared/services/events/event.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChangeEvent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { UploadAdapter } from 'src/app/shared/services/upload-adapter';
import { AppInjector } from 'src/app/app.module';
import { RoleChoice } from 'src/app/shared/interfaces/event-role-choices';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { errorProcess } from 'src/app/shared/utils/error-process';
import { DateTimePickerDialogComponent } from 'src/app/shared/components/date-time-picker-dialog/date-time-picker-dialog.component';
import { PlatformService } from 'src/app/shared/services/platform.service';

@Component({
  selector: 'app-admin-campus-form',
  templateUrl: './admin-campus-form.component.html',
  styleUrls: ['./admin-campus-form.component.css']
})
export class AdminCampusFormComponent implements OnInit {
  editor = DecoupledEditor;
  editorConfig = {
    language: 'zh-cn',
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

  roleChoices: RoleChoice[] = [];
  roundChoices: RoundChoice[] = [];
  programId: number;
  isUpdateMode = false;
  event: CampusEvent;
  isLoading = false;
  eventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    time: ['', [Validators.required, Validators.maxLength(30)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    numHours: ['', [Validators.required]],
    numParticipants: ['', [Validators.required]],
    deadline: ['', [Validators.required, Validators.maxLength(30)]],
    description: ['', [Validators.required]],
    coefficients: this.fb.array([]),
  });


  constructor(
    readonly urlLocation: Location,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly eventService: EventService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly recordService: RecordService,
    private readonly platformService: PlatformService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.programId = this.route.snapshot.params.id;

    if (this.route.snapshot.queryParams.event_id !== undefined) {
      this.isUpdateMode = true;
      const eventID = this.route.snapshot.queryParams.event_id;
      this.eventService.getRoundChoices().pipe(
        switchMap(roundChoices => {
          this.roundChoices = roundChoices;
          return this.eventService.getEvent(eventID);
        })
      ).subscribe(
        (event: CampusEvent) => {
          this.setEventValue(event);
        },
        (error: HttpErrorResponse) => {
          const message = errorProcess(error);
          this.snackBar.open(message, '关闭');
        });
    } else {
       this.recordService.getRoleChoices().pipe(
          switchMap(roleChoices => {
            this.roleChoices = roleChoices;
            return this.eventService.getRoundChoices();
          })
        ).subscribe(roundChoices => {
          this.roundChoices = roundChoices;
          for (let i = 0; i < this.roleChoices.length; i++) {
            const control = this.fb.group({
              role: this.roleChoices[i].role,
              coefficient: [0, [Validators.required]],
              hours_option: '',
              workload_option: '',
            });

            control.get('hours_option').setValue(this.roundChoices[0].type);
            control.get('workload_option').setValue(this.roundChoices[0].type);
            this.coefficients.push(control);
          }
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
    for (let i = 0; i < event.coefficients.length; i++) {
      this.roleChoices.push({role: event.coefficients[i].role, role_str: event.coefficients[i].role_str});

      const control = this.fb.group({
        role: event.coefficients[i].role,
        coefficient: [event.coefficients[i].coefficient, [Validators.required]],
        hours_option: event.coefficients[i].hours_option,
        workload_option: event.coefficients[i].workload_option,
      });

      this.coefficients.push(control);
    }
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
  get coefficients() {
    return this.eventForm.get('coefficients') as FormArray;
  }

  onSubmit() {
    this.isLoading = true;
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
      coefficients: this.isUpdateMode ? undefined : this.eventForm.value.coefficients,
    };
    const targetEvent: Observable<CampusEvent> = this.isUpdateMode ?
                                             this.eventService.updateCampusEvent(req) :
                                             this.eventService.createCampusEvent(req);
    targetEvent.subscribe(
      event => {
        this.router.navigate(['admin/programs', this.programId, 'events', event.id]);
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
        this.isLoading = false;
      });
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
