import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { MatCardModule, MatDividerModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AdminProgramDetailComponent } from './admin-program-detail.component';
import { Program } from 'src/app/shared/interfaces/program';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';

describe('AdminProgramDetailComponent', () => {
  let component: AdminProgramDetailComponent;
  let fixture: ComponentFixture<AdminProgramDetailComponent>;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        AdminProgramDetailComponent,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
      ],
      imports: [
        MatCardModule,
        MatDividerModule,
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
    fixture = TestBed.createComponent(AdminProgramDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to change-program', () => {
    component.navigateToChangeProgram();

    expect(navigate).toHaveBeenCalledWith(
      ['/admin/programs/form'], { queryParams: {program_id: 2} });
  });
});
