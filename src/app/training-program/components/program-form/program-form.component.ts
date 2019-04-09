import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { ProgramRequest } from 'src/app/shared/interfaces/program';
import { ProgramService} from '../../services/program.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

@Component({
  selector: 'app-program-form',
  templateUrl: './program-form.component.html',
  styleUrls: ['./program-form.component.css']
})
export class ProgramFormComponent implements OnInit {

  programForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    categoryId: ['', [Validators.required]],
    formsId: ['', [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly programService: ProgramService,
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  ngOnInit() {
  }

  get name() {
    return this.programForm.get('name');
  }
  get categoryId() {
    return this.programForm.get('categoryId');
  }
  get formsId() {
    return this.programForm.get('formsId');
  }

  onSubmit() {
    const req: ProgramRequest = {
      department: this.authService.department,
      category: this.programForm.value.categoryId,
      name: this.programForm.value.name,
      form: this.programForm.value.formsId,
    };
    this.programService.createProgram(req).subscribe(
      program => {
        this.router.navigate(['../program-detail/', program.id]);
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
