import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrasticDComponent } from './drastic-d.component';

describe('DrasticComponent', () => {
  let component: DrasticDComponent;
  let fixture: ComponentFixture<DrasticDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrasticDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrasticDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
