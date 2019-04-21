import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService } from '../../services/program.service';
import { ProgramListComponent } from './program-list.component';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('ProgramListComponent', () => {
  let component: ProgramListComponent;
  let fixture: ComponentFixture<ProgramListComponent>;
  let getPrograms$: Subject<PaginatedResponse<Program>>;
  let navigate: jasmine.Spy;
  let getPrograms: jasmine.Spy;

  const dummyProgram: Program = {
    id: 1,
    name: 'sender',
    department: 2,
    category: 3,
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getPrograms$ = new Subject<PaginatedResponse<Program>>();
    getPrograms = jasmine.createSpy();
    getPrograms.and.returnValue(getPrograms$);
    TestBed.configureTestingModule({
      declarations: [
        ProgramListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
        {
          provide: ProgramService,
          useValue: {
            getPrograms,
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const count = 100;
    const results: Program[] = [dummyProgram, dummyProgram];
    getPrograms$.next({ count, results, next: '', previous: '' });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.programs).toEqual(results);
  });

  it('should empty data if an error encountered.', () => {
    getPrograms$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.programs).toEqual([]);
  });

  it('should navigate to detail', () => {
    component.navigateToRelatedEvents(dummyProgram);

    expect(navigate).toHaveBeenCalledWith(
      ['/admin/event-management/programs/events'], { queryParams: {program_id: dummyProgram.id} });
  });
});

