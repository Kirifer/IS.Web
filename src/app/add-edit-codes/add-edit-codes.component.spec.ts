import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCodesComponent } from './add-edit-codes.component';

describe('AddEditCodesComponent', () => {
  let component: AddEditCodesComponent;
  let fixture: ComponentFixture<AddEditCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
