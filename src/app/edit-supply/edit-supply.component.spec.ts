import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplyComponent } from './edit-supply.component';

describe('EditSupplyComponent', () => {
  let component: EditSupplyComponent;
  let fixture: ComponentFixture<EditSupplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSupplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
