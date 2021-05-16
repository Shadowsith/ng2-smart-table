import {Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Grid } from '../../../lib/grid';

@Component({
  selector: 'ng2-st-actions',
  template: `
    <a href="#" class="ng2-smart-action ng2-smart-action-add-create"
        [innerHTML]="createButtonContent"
        (click)="$event.preventDefault();create.emit($event)"></a>
    <a href="#" class="ng2-smart-action ng2-smart-action-add-cancel"
        [innerHTML]="cancelButtonContent"
        (click)="onCancel($event)"></a>
  `,
})
export class ActionsComponent implements OnChanges {

  @Input() grid: Grid;
  @Output() create = new EventEmitter<any>();
  @Output() createCancel = new EventEmitter<any>();

  createButtonContent: string;
  cancelButtonContent: string;

  onCancel(event: any) {
    event.preventDefault();
    this.grid.createFormShown = false;
    const ev = {
        cancelData: this.getCancelData(),
        source: this.grid.source,
    };
    this.createCancel.emit(ev);
  }

  private getCancelData(): Object {
      const row = {};
      for(const cell of this.grid.dataSet.newRow.cells) {
          row[cell.getId()] = cell.newValue;
      }
      return row;
  }

  ngOnChanges() {
    this.createButtonContent = this.grid.getSetting('add.createButtonContent');
    this.cancelButtonContent = this.grid.getSetting('add.cancelButtonContent');
  }
}
