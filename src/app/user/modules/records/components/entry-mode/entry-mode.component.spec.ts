import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { EntryModeComponent } from './entry-mode.component';
import { RouterLinkDirectiveStub } from 'src/testing/router-link-directive-stub';


describe('EntryModeComponent', () => {
  let component: EntryModeComponent;
  let fixture: ComponentFixture<EntryModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        RouterTestingModule,
      ],
      declarations: [
        EntryModeComponent,
        RouterLinkDirectiveStub,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain router links to other components', () => {
    fixture.detectChanges();

    const routerLinks = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .map(de => de.injector.get(RouterLinkDirectiveStub));

      expect(routerLinks.length).toBe(2);
      expect(routerLinks[0].linkParams).toBe('./record-form');
      expect(routerLinks[1].linkParams).toBe('./batch-submit');
  });
});

