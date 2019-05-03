import {HttpClientTestingModule} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {StyleManager} from './style-manager.service';


describe('StyleManager', () => {
  let styleManager: StyleManager;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [StyleManager]
  }));

  beforeEach(inject([StyleManager], (sm: StyleManager) => {
    styleManager = sm;
  }));

  it('should set theme', () => {
    styleManager.themeChanged.subscribe((theme) => {
      expect(theme.name).toBe('indigo-pink');
    });

    styleManager.setTheme({name: 'indigo-pink', accent: '', primary: ''});
  });

});
