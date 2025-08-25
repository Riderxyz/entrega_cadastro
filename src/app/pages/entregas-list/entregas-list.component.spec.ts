import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasListComponent } from './entregas-list.component';

describe('EntregasListComponent', () => {
  let component: EntregasListComponent;
  let fixture: ComponentFixture<EntregasListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntregasListComponent]
    });
    fixture = TestBed.createComponent(EntregasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
