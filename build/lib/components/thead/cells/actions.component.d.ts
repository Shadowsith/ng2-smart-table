import { EventEmitter, OnChanges } from '@angular/core';
import { Grid } from '../../../lib/grid';
export declare class ActionsComponent implements OnChanges {
    grid: Grid;
    create: EventEmitter<any>;
    createCancel: EventEmitter<any>;
    createButtonContent: string;
    cancelButtonContent: string;
    onCancel(event: any): void;
    private getCancelData;
    ngOnChanges(): void;
}
