import { CampusEventListComponent } from './campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { AppSharedCampusEventListStub } from 'src/testing/app-shared-campus-event-list-stub';

describe('CampusEventListComponent', () => {
  let component: CampusEventListComponent;
  let fixture: ComponentFixture<CampusEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampusEventListComponent,
        AppSharedCampusEventListStub
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
