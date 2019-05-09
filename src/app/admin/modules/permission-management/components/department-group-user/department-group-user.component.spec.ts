import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentGroupUserComponent } from './department-group-user.component';

describe('DepartmentGroupUserComponent', () => {
  let component: DepartmentGroupUserComponent;
  let fixture: ComponentFixture<DepartmentGroupUserComponent>;

  let getUsersByGroupId: jasmine.Spy;
  let getUsersByGroupId$: Subject<PaginatedResponse<User>>;
  beforeEach(async(() => {
    open = jasmine.createSpy();
    dialogRef = jasmine.createSpyObj('', ['afterClosed']);
    afterClosed$ = new Subject();

    addUserGroup = jasmine.createSpy();
    userGroup$ = new Subject();

    removeUserByUserGroupId = jasmine.createSpy();
    removeUserByUserGroupId$ = new Subject();

    getUsersByGroupId = jasmine.createSpy();
    getUsersByGroupId$ = new Subject<PaginatedResponse<User>>();
    getUsersByGroupId.and.returnValue(getUsersByGroupId$);

    TestBed.configureTestingModule({
      declarations: [ DepartmentGroupUserComponent ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatPaginatorModule,
        MatSelectModule,
        MatInputModule,
        MatDividerModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
          }
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: GroupService,
          useValue: {
            getUsersByGroupId: () => getUsersByGroupId$,
            addUserGroup,
            removeUserByUserGroupId,
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open,
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get results', () => {
    expect(component.getResults(0, 0)).toBe(getUsersByGroupId$);
  });

  it('should on Group remove', () => {
    const id = 5;
    removeUserByUserGroupId.and.returnValue(removeUserByUserGroupId$);
    component.onGroupRemove(id);

    removeUserByUserGroupId$.next({});

    expect(removeUserByUserGroupId).toHaveBeenCalledWith(id);
  });

  it('should open dialog', () => {
    open.and.returnValue(dialogRef);
    dialogRef.afterClosed.and.returnValue(afterClosed$);
    addUserGroup.and.returnValue(userGroup$);

    component.openDialog();

    afterClosed$.next('123');
    userGroup$.next({});
    expect(open).toHaveBeenCalled();
    expect(addUserGroup).toHaveBeenCalledWith('123', component.group.id);
  });


});
