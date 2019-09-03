import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLayerControlComponent } from './edit-layer-control.component';

describe('EditLayerControlComponent', () => {
  let component: EditLayerControlComponent;
  let fixture: ComponentFixture<EditLayerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLayerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLayerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
