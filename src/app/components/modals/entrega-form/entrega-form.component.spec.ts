import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaFormComponent } from './entrega-form.component';

describe('EntregaFormComponent', () => {
  let component: EntregaFormComponent;
  let fixture: ComponentFixture<EntregaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntregaFormComponent]
    });
    fixture = TestBed.createComponent(EntregaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
