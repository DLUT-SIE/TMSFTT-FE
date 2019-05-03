import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemePickerComponent } from './theme-picker.component';
import { MatIconModule, MatSnackBar } from '@angular/material';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { ThemeStorage } from './theme-storage.service';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let getStoredThemeName: jasmine.Spy;
  let storeTheme: jasmine.Spy;
  let setTheme: jasmine.Spy;

  beforeEach(async(() => {
    getStoredThemeName = jasmine.createSpy().and.returnValue('indigo-pink');
    storeTheme = jasmine.createSpy();
    setTheme = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
      ],
      providers: [
        {
          provide: StyleManager,
          useValue: {
            setTheme,
          },
        },
        {
          provide: ThemeStorage,
          useValue: {
            getStoredThemeName, storeTheme,
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: () => {},
          },
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

  it('should set theme', () => {
    component.installTheme('deeppurple-amber');
    expect(setTheme).toHaveBeenCalledWith({
      primary: '#673AB7',
      accent: '#FFC107',
      name: 'deeppurple-amber',
    });
    expect(storeTheme).toHaveBeenCalledWith(component.themes[0]);
  });

});
