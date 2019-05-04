import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {StyleManager} from './style-manager.service';
import { MatSnackBar } from '@angular/material';


describe('StyleManager', () => {
  let styleManager: StyleManager;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {
        provide: MatSnackBar,
        useValue: {},
      }
    ]
  }));

  beforeEach(() => {
    // Container
    const div = document.createElement('div');
    div.setAttribute('id', 'themeContainer');
    document.body.append(div);

    // Stylesheet
    const style = document.createElement('style');
    style.innerHTML = '\
    .color-primary {color: rgb(255, 0, 0)} \
    .color-accent {color: rgb(0, 255, 0)} \
    .color-warn {color: rgb(0, 0, 255)}';
    document.head.append(style);

    styleManager = TestBed.get(StyleManager);
    styleManager.setTheme('indigo-pink');
  });

  it('should set theme', () => {
    styleManager.themeChanged.subscribe((theme) => {
      expect(theme.name).toBe('indigo-blue');
    });

    styleManager.setTheme('indigo-blue');
  });

  it('should set theme (fallback to default)', () => {
    styleManager.themeChanged.subscribe((theme) => {
      expect(theme.name).toBe('indigo-blue');
    });

    styleManager.setTheme('not-exist');
  });


  it('should get primary color', () => {
    expect(styleManager.getColor('primary')).toEqual('rgb(255, 0, 0)');
  });
});
