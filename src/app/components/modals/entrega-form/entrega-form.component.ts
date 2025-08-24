import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  EntregaInterface,
  EntregaStatus,
  getEmptyEntrega,
} from 'src/app/interfaces/entrega.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { EntregaService } from 'src/app/service/entregas.service';
import { v4 as uuidv4 } from 'uuid';
import { UtilService } from 'src/app/service/util.service';
import { debounce, debounceTime, filter } from 'rxjs';
import { ToastService } from 'src/app/service/toast.service';
interface SelectOption<T = any> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-entrega-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    InputMaskModule,
    CardModule,
    DividerModule,
  ],
  templateUrl: './entrega-form.component.html',
  styleUrls: ['./entrega-form.component.scss'],
})
export class EntregaFormComponent {
  statusOptions: SelectOption<EntregaStatus>[] = [
    { label: 'Pendente', value: EntregaStatus.Pendente },
    { label: 'Em Rota', value: EntregaStatus.EmRota },
    { label: 'Entregue', value: EntregaStatus.Entregue },
    { label: 'Cancelada', value: EntregaStatus.Cancelada },
  ];
  ufOptions: SelectOption<string>[] = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ].map((uf) => ({ label: uf, value: uf }));
  entregaObject: EntregaInterface = getEmptyEntrega();
  minEnvio = new Date(new Date().setDate(new Date().getDate() - 30)); // exemplo: 30 dias atrás
  maxEnvio = new Date(new Date().setDate(new Date().getDate() + 1));
  minEntrega = new Date();
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  private readonly toastSrv: ToastService = inject(ToastService);
  private readonly utilSrv: UtilService = inject(UtilService);
  constructor() {}

  onSubmit(form: NgForm) {
    if (this.entregaObject.id === '') {
      this.entregaObject.id = uuidv4();
    }
    this.entregaSrv.updateEntrega(this.entregaObject).then((res) => {});
  }

  onCepChange() {
    console.log(this.entregaObject.endereco.cep);
    const cepLimpo = this.entregaObject.endereco.cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      this.utilSrv
        .getEnderecoByCep(this.entregaObject.endereco.cep)
        .pipe(debounceTime(1500))
        .subscribe({
          next: (endereco) => {
            this.entregaObject.endereco = { ...endereco, numero: '0' };
            //this.entregaObject.endereco.cep = cepLimpo;
          },
          error: (err) => {
            console.warn(err);
            this.toastSrv.notify(
              'error',
              'CEP não encontrado',
              'Por favor, insira os dados manualmente ou tente novamente',
              3000
            );
          },
        });
    }
  }
}
