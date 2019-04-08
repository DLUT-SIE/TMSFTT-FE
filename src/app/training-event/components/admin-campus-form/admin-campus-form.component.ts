import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-campus-form',
  templateUrl: './admin-campus-form.component.html',
  styleUrls: ['./admin-campus-form.component.css']
})
export class AdminCampusFormComponent implements OnInit {
  
  eventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    time: ['', [Validators.required, Validators.maxLength(30)]],
    location: ['', [Validators.required, Validators.maxLength(50)]],
    numHours: ['', [Validators.required]],
    numParticipants: ['', [Validators.required]],
    deadline: ['', [Validators.required, Validators.maxLength(30)]],
    description: ['', [Validators.required, Validators.maxLength(200)]],
  })
  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
