import { EventEmitter, OnChanges } from '@angular/core';
import { Grid } from '../../../lib/grid';
import { Row } from '../../../lib/data-set/row';
export declare class TbodyCreateCancelComponent implements OnChanges {
    grid: Grid;
    row: Row;
    editConfirm: EventEmitter<any>;
    cancel: EventEmitter<any>;
    cancelButtonContent: string;
    saveButtonContent: string;
    onSave(event: any): void;
    onCancelEdit(event: any): void;
    private getCancelData;
    ngOnChanges(): void;
}
