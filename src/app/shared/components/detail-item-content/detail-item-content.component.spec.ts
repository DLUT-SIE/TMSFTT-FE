import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailItemContentComponent } from './detail-item-content.component';

describe('DetailItemContentComponent', () => {
  let component: DetailItemContentComponent;
  let fixture: ComponentFixture<DetailItemContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailItemContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
