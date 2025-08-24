import { Component, Input } from '@angular/core';
import { StatusCardInterface } from 'src/app/interfaces/statusCard.onterface';

@Component({
  selector: 'app-status-cards',
  templateUrl: './status-cards.component.html',
  styleUrls: ['./status-cards.component.scss']
})
export class StatusCardsComponent {
  @Input() card!: StatusCardInterface;
}
