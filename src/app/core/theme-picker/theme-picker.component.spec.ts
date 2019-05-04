import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemePickerComponent } from './theme-picker.component';
import { MatIconModule } from '@angular/material';
import { StyleManager } from 'src/app/shared/services/style-manager.service';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
      ],
      providers: [
        {
          provide: StyleManager,
          useValue: {},
        },
      ],
      declarations: [ ThemePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
