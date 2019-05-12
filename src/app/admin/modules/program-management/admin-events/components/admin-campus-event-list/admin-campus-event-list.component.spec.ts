import { AdminCampusEventListComponent } from './admin-campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf, Subject } from 'rxjs';
import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { AppSharedCampusEventListStub } from 'src/testing/app-shared-campus-event-list-stub';

describe('AdminCampusEventListComponent', () => {
  let component: AdminCampusEventListComponent;
  let fixture: ComponentFixture<AdminCampusEventListComponent>;
  let getProgram$: Subject<Program>;
  let getProgram: jasmine.Spy;

  const route = {
    queryParams: observableOf({ program_id: 1 }),
    snapshot: {
      queryParamMap: {
        get: () => '1',
      },
    }
  };

  const dummyProgram: Program = {
    id: 1,
    name: 'sender',
    department: 2,
    category: 3,
    form: [],
  };

  beforeEach(async(() => {
    getProgram$ = new Subject<Program>();
    getProgram = jasmine.createSpy();
    getProgram.and.returnValue(getProgram$);

    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventListComponent,
        AppSharedCampusEventListStub
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: route,
        },
        {
          provide: ProgramService,
          useValue: {
            getProgram
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
    fixture = TestBed.createComponent(AdminCampusEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    getProgram.and.returnValue(getProgram$);
    getProgram$.next(dummyProgram);
    expect(component.program).toBe(dummyProgram);
    expect(getProgram).toHaveBeenCalled();
  });

});
