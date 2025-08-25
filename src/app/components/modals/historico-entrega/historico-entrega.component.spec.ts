import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoEntregaComponent } from './historico-entrega.component';

describe('HistoricoEntregaComponent', () => {
  let component: HistoricoEntregaComponent;
  let fixture: ComponentFixture<HistoricoEntregaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricoEntregaComponent]
    });
    fixture = TestBed.createComponent(HistoricoEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
