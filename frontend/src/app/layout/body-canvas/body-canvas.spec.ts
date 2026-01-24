import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyCanvas } from './body-canvas';

describe('BodyCanvas', () => {
  let component: BodyCanvas;
  let fixture: ComponentFixture<BodyCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyCanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyCanvas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
