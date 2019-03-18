import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Program } from 'src/app/interfaces/program';
import { ProgramService } from '../../services/program.service';
import { ProgramListComponent } from './program-list.component';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

describe('ProgramListComponent', () => {
  let component: ProgramListComponent;
  let fixture: ComponentFixture<ProgramListComponent>;
  let getPrograms$: Subject<PaginatedResponse<Program>>;
  let navigate: jasmine.Spy;
  let getPrograms: jasmine.Spy;


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

});

