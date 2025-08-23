import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerarRelatorioComponent } from './gerar-relatorio.component';

describe('GerarRelatorioComponent', () => {
  let component: GerarRelatorioComponent;
  let fixture: ComponentFixture<GerarRelatorioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GerarRelatorioComponent]
    });
    fixture = TestBed.createComponent(GerarRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
