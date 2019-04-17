import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { MatCardModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ProgramDetailComponent } from './program-detail.component';
import { Program } from 'src/app/shared/interfaces/program';

describe('ProgramDetailComponent', () => {
  let component: ProgramDetailComponent;
  let fixture: ComponentFixture<ProgramDetailComponent>;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ ProgramDetailComponent ],
      imports: [
        MatCardModule,
      ],
      providers: [
        {
          provide: Location,
          useValue: {
            back: () => {},
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: observableOf({program: {
              id: 2,
              name: 'sender',
              department: 2,
              category: 3,
              department_detail: {
                id: 2,
                create_time: '2019-3-15',
                update_time: '2019-3-16',
                name: 'lgz',
                admins: [],
              },
              category_detail: {
                id: 2,
                name: 'lgz'
              },
              form: [],
            } as Program}),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to change-program', () => {
    component.navigateToChangeProgram();

    expect(navigate).toHaveBeenCalledWith(
      ['/admin/event-management/programs/program-form'], { queryParams: {program_id: 2} });
  });
});
