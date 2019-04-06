import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-program-form',
  templateUrl: './program-form.component.html',
  styleUrls: ['./program-form.component.css']
})
export class ProgramFormComponent implements OnInit {

  programForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    form_id: ['', [Validators.required]],
    category_id: ['', [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
