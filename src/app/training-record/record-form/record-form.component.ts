import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

/** RecordFormComponent provides Record form and handle creation logic. */
@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.css']
})
export class RecordFormComponent implements OnInit {
  recordForm = this.fb.group({
    name: ['', Validators.required ],
    time: ['', Validators.required ],
    location: ['', Validators.required ],
    num_hours: ['', Validators.required ],
    num_participants: ['', Validators.required ],
    content: [''],
    summary: [''],
    feedback: [''],
    files: this.fb.array([
      this.fb.control(''),
    ]),
  });

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  get name() {
    return this.recordForm.get('name');
  }

  get time() {
    return this.recordForm.get('time');
  }

  get location() {
    return this.recordForm.get('location');
  }

  get numHours() {
    return this.recordForm.get('num_hours');
  }

  get numParticipants() {
    return this.recordForm.get('num_participants');
  }

  get files() {
    return this.recordForm.get('files') as FormArray;
  }

  onSubmit() {
    console.log(this.recordForm.value);
  }

  /** Push a new FormControl to FormArray, this supports multi files uploading. */
  addFile() {
    this.files.push(this.fb.control(''));
  }
}
