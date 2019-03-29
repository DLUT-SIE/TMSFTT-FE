import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { MatCardModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ProgramDetailComponent } from './program-detail.component';
import { Program } from 'src/app/interfaces/program';

describe('ProgramDetailComponent', () => {
  let component: ProgramDetailComponent;
  let fixture: ComponentFixture<ProgramDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramDetailComponent ],
      imports: [
        MatCardModule,
      ],
      providers: [
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
                admins_detail: {
                  id: 2,
                  username: 'lgz',
                  last_login: 'dh',
                  first_name: 'l',
                  last_name: 'gz',
                  email: '333',
                  is_active: false,
                  data_joined:'2019-3-2',
                  user_permissions:[]
                }
              },
              category_detail: {
                id: 2,
                name: 'lgz'
              },
              form: [],
            } as Program}),
          },
        }
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
});
