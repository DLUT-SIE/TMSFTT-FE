import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { TrainingRecordEntryModeComponent } from './training-record-entry-mode.component';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';


describe('TrainingRecordEntryModeComponent', () => {
  let component: TrainingRecordEntryModeComponent;
  let fixture: ComponentFixture<TrainingRecordEntryModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        RouterTestingModule,
      ],
      declarations: [
        TrainingRecordEntryModeComponent,
        RouterLinkDirectiveStub,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingRecordEntryModeComponent);
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
      expect(routerLinks[0].linkParams).toBe(
        '/training-record-entry/entry-form');
      expect(routerLinks[1].linkParams).toBe(
        '/training-record-entry/batch-submit');
  });
});
