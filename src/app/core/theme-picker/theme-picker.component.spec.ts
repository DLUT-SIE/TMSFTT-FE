import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemePickerComponent } from './theme-picker.component';
import { MatIconModule } from '@angular/material';
import { StyleManager } from 'src/app/shared/services/style-manager.service';
import { ThemeStorage } from './theme-storage.service';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let getStoredThemeName: jasmine.Spy;
  let storeTheme: jasmine.Spy;
  let removeStyle: jasmine.Spy;
  let setStyle: jasmine.Spy;

  beforeEach(async(() => {
    getStoredThemeName = jasmine.createSpy().and.returnValue('indigo-pink');
    storeTheme = jasmine.createSpy();
    removeStyle = jasmine.createSpy();
    setStyle = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
      ],
      providers: [
        {
          provide: StyleManager,
          useValue: {
            removeStyle, setStyle,
          },
        },
        {
          provide: ThemeStorage,
          useValue: {
            getStoredThemeName, storeTheme,
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

  it('should remove default theme', () => {
    component.installTheme('indigo-pink');
    expect(removeStyle).toHaveBeenCalledWith('theme');
  });

  it('should set theme', () => {
    component.installTheme('purple-green');
    expect(setStyle).toHaveBeenCalledWith('theme', 'assets/css/purple-green.css');
    expect(storeTheme).toHaveBeenCalledWith(component.themes[3]);
  });

});
