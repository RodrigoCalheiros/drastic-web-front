import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrasticComponent } from './drastic.component';

describe('DrasticComponent', () => {
  let component: DrasticComponent;
  let fixture: ComponentFixture<DrasticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrasticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrasticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
