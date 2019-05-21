import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';
import { ProgramService} from 'src/app/shared/services/programs/program.service';
import { AuthService, AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { Observable } from 'rxjs';

/* Create or update a admin-program-form**/
@Component({
  selector: 'app-admin-program-form',
  templateUrl: './admin-program-form.component.html',
  styleUrls: ['./admin-program-form.component.css']
})
export class AdminProgramFormComponent implements OnInit {

  programCategories: ProgramCategory[] = [];
  programId: number;
  program: Program;
  isUpdateMode = false;

  programForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    categoryId: ['', [Validators.required]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly programService: ProgramService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    readonly location: Location,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.programService.getProgramCategories().subscribe(programCategories => {
      this.programCategories = programCategories;
    });

    /* istanbul ignore else  */
    if (this.route.snapshot.queryParams.program_id !== undefined) {
      const programId = this.route.snapshot.queryParams.program_id;
      this.isUpdateMode = true;
      this.programService.getProgram(Number(programId)).
        subscribe(
          program => {
            this.program = program;
            this.name.setValue(this.program.name);
            this.categoryId.setValue(this.program.category);
        });
      }
  }

  get name() {
    return this.programForm.get('name');
  }
  get categoryId() {
    return this.programForm.get('categoryId');
  }

  onSubmit() {
    const req: Program = {
      id: this.isUpdateMode ? this.program.id : undefined,
      department: this.authService.department,
      category: this.programForm.value.categoryId,
      name: this.programForm.value.name,
    };
    const targetProgram: Observable<Program> = this.isUpdateMode ?
                                            this.programService.updateProgram(req) :
                                            this.programService.createProgram(req);
    targetProgram.subscribe(
      program => {
        this.router.navigate(['/admin/programs/', program.id]);
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
