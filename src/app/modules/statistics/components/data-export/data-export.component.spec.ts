import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatIconModule, MatDatepickerModule, MatPaginatorModule, MatProgressSpinnerModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DataExportComponent } from './data-export.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';

describe('DataExportComponent', () => {
  let component: DataExportComponent;
  let fixture: ComponentFixture<DataExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataExportComponent],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatIconModule,
        MatDatepickerModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
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
    fixture = TestBed.createComponent(DataExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
