import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailItemTitleComponent } from './detail-item-title.component';

describe('DetailItemTitleComponent', () => {
  let component: DetailItemTitleComponent;
  let fixture: ComponentFixture<DetailItemTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailItemTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailItemTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
