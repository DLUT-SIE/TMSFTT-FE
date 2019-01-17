import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatSelectModule,
} from '@angular/material';

import { RecordFormComponent } from './record-form.component';

describe('RecordFormComponent', () => {
  let component: RecordFormComponent;
  let fixture: ComponentFixture<RecordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatSelectModule,
      ],
      declarations: [RecordFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new FormControl to FormArray.', () => {
    component.addFile();
    component.addFile();

    expect(component.files.length).toBe(3);
  });

  it('should call service to create the record.', () => {
    component.onSubmit();

    // TODO(youchen): Do real test.
  });

});
