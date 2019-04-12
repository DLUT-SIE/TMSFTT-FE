import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';

import { ProgramRequest } from 'src/app/shared/interfaces/program';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';
import { ProgramForm } from 'src/app/shared/interfaces/program-form';
import { ProgramService} from '../../services/program.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

@Component({
  selector: 'app-program-form',
  templateUrl: './program-form.component.html',
  styleUrls: ['./program-form.component.css']
})
export class ProgramFormComponent implements OnInit {

  programCategories: ProgramCategory[] = [];
  programForms: ProgramForm[] = [];

  programForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    categoryId: ['', [Validators.required]],
    formIds: ['', [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly programService: ProgramService,
    private readonly router: Router,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.programService.getProgramCategory().pipe(
      map(data => {
      return data.results;
    })).subscribe(
      programCategories => {this.programCategories = programCategories;
      }
    );
    this.programService.getProgramForm().pipe(
      map(data => {
      return data.results;
    })).subscribe(
      programForms => {this.programForms = programForms;
      }
    );
  }

  get name() {
    return this.programForm.get('name');
  }
  get categoryId() {
    return this.programForm.get('categoryId');
  }
  get formIds() {
    return this.programForm.get('formIds');
  }

  onSubmit() {
    const req: ProgramRequest = {
      department: this.authService.department,
      category: this.programForm.value.categoryId,
      name: this.programForm.value.name,
      form: this.programForm.value.formIds,
    };
    this.programService.createProgram(req).subscribe(
      program => {
        this.router.navigate(['/admin/event-management/programs/events'], { queryParams: {program_id: program.id}});
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
