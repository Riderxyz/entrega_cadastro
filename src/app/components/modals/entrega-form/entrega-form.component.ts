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
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ESTADOS_BRASIL,
  RegiaoBrasilNomeEnum,
  UfSigla,
} from 'src/app/interfaces/regioesBrasil.interface';
import { AuthService } from 'src/app/service/auth.service';
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
  regioesOptions = Object.values(RegiaoBrasilNomeEnum).map((r) => ({
    label: r,
    value: r,
  }));
  ufOptions: { label: string; value: UfSigla }[] = [];
  entregaObject: EntregaInterface = getEmptyEntrega();
  minEnvio = new Date(new Date().setDate(new Date().getDate() - 30));
  maxEnvio = new Date(new Date().setDate(new Date().getDate() + 1));
  minEntrega = new Date();
  EntregaStatus = EntregaStatus;
  private readonly entregaSrv: EntregaService = inject(EntregaService);
  private readonly toastSrv: ToastService = inject(ToastService);
  private readonly utilSrv: UtilService = inject(UtilService);
  private readonly authSrv: AuthService = inject(AuthService);
  private userID = '';
  private readonly dynamicDialogConfig: DynamicDialogConfig = inject(
    DynamicDialogConfig<EntregaInterface>
  );
  private readonly ref = inject(DynamicDialogRef);
  constructor() {
    this.dynamicDialogConfig.data.entrega
      ? (this.entregaObject = this.dynamicDialogConfig.data.entrega)
      : (this.entregaObject = getEmptyEntrega());
    this.authSrv.authUser$.subscribe({
      next: (user) => {
        this.userID = user?.uid ?? '';
      },
    });
  }

  onSubmit(form: NgForm) {
    if (this.entregaObject.id === '') {
      this.entregaObject.id = uuidv4();
      this.entregaObject.createdBy = this.userID;
      this.entregaObject.createdAt = new Date();
      this.entregaObject.updatedAt = new Date();
    } else {
      this.entregaObject.updatedBy = this.userID;
      this.entregaObject.updatedAt = new Date();
    }

    this.entregaSrv.updateEntrega(this.entregaObject).then((res) => {
      this.entregaSrv
        .addHistoricoEntrega(this.entregaObject.id, {
          status: this.entregaObject.status,
          date: new Date(),
          id: uuidv4(),
          observacoes: '',
        })
        .then((res) => {
          this.toastSrv.notify(
            'success',
            'Sucesso',
            'Entrega salva com sucesso',
            3000
          );
          this.ref.close(this.entregaObject);
        });
    });
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
            this.onChangeRegiao(endereco.regiao);
            this.entregaObject.endereco = { ...endereco, numero: '0' };
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

  onChangeRegiao(regiao: RegiaoBrasilNomeEnum) {
    // filtra UFs pela região escolhida
    this.ufOptions = ESTADOS_BRASIL.filter((e) => e.regiao === regiao).map(
      (e) => ({ label: `${e.uf} - ${e.nome}`, value: e.uf })
    );

    // reseta UF e Estado quando mudar de região
    this.entregaObject.endereco.uf = '' as UfSigla;
    this.entregaObject.endereco.estado = '';
  }
  onChangeUf(uf: UfSigla) {
    const estado = ESTADOS_BRASIL.find((e) => e.uf === uf);
    if (estado) {
      this.entregaObject.endereco.estado = estado.nome;
      this.entregaObject.endereco.regiao = estado.regiao;
    }
  }
}
