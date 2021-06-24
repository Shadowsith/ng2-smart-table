import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Grid } from './lib/grid';
import { DataSource } from './lib/data-source/data-source';
import { deepExtend, getPageForRowIndex } from './lib/helpers';
import { LocalDataSource } from './lib/data-source/local/local.data-source';
export class Ng2SmartTableComponent {
    constructor() {
        this.rowSelect = new EventEmitter();
        this.rowDeselect = new EventEmitter();
        this.userRowSelect = new EventEmitter();
        this.pageChange = new EventEmitter();
        this.delete = new EventEmitter();
        this.edit = new EventEmitter();
        this.editCancel = new EventEmitter();
        this.create = new EventEmitter();
        this.createCancel = new EventEmitter();
        this.custom = new EventEmitter();
        this.deleteConfirm = new EventEmitter();
        this.editConfirm = new EventEmitter();
        this.createConfirm = new EventEmitter();
        this.rowHover = new EventEmitter();
        this.defaultSettings = {
            mode: 'inline',
            selectMode: 'single',
            /**
             * Points to an element in all data
             *
             * when < 0 all lines must be deselected
             */
            selectedRowIndex: 0,
            switchPageToSelectedRowPage: false,
            hideHeader: false,
            hideSubHeader: false,
            actions: {
                columnTitle: 'Actions',
                add: true,
                edit: true,
                delete: true,
                custom: [],
                position: 'left',
            },
            filter: {
                inputClass: '',
            },
            edit: {
                inputClass: '',
                editButtonContent: 'Edit',
                saveButtonContent: 'Update',
                cancelButtonContent: 'Cancel',
                confirmSave: false,
            },
            add: {
                inputClass: '',
                addButtonContent: 'Add New',
                createButtonContent: 'Create',
                cancelButtonContent: 'Cancel',
                confirmCreate: false,
            },
            delete: {
                deleteButtonContent: 'Delete',
                confirmDelete: false,
            },
            attr: {
                id: '',
                class: '',
            },
            noDataMessage: 'No data found',
            columns: {},
            pager: {
                display: true,
                page: 1,
                perPage: 10,
            },
            infiniteScroll: {
                display: false,
                itemSize: 10,
                class: 'ng2-smart-table-default-infinite-scroll',
            },
            rowClassFunction: () => '',
        };
        this.isAllSelected = false;
        this.destroyed$ = new Subject();
    }
    ngAfterViewInit() {
        if (this.grid.getSetting('infiniteScroll.display')) {
            this.resizeMultiHeads();
        }
    }
    resizeMultiHeads() {
        setTimeout((() => {
            let els = document.getElementsByClassName('ng2-smart-actions');
            /* Let's divide the element list by 2, the  */
            [].forEach.call(els, ((el) => {
                /* Search for the same element inside the same array */
                const currentClassName = el.className;
                let elementWidth = el.offsetWidth;
                [].forEach.call(els, ((otherElement) => {
                    if (otherElement.className === el.className) {
                        elementWidth = otherElement.offsetWidth;
                    }
                }));
                el.width = elementWidth;
            }).bind(this));
            els = document.getElementsByClassName('ng2-smart-th');
            [].forEach.call(els, ((el) => {
                /* Search for the same element inside the same array */
                const currentClassName = el.className;
                let elementWidth = el.offsetWidth;
                [].forEach.call(els, ((otherElement) => {
                    if (otherElement.className === el.className) {
                        elementWidth = otherElement.offsetWidth;
                    }
                }));
                el.width = elementWidth;
            }).bind(this));
        }), 10);
    }
    resetColumnSize() {
        let els = document.getElementsByClassName('ng2-smart-actions');
        [].forEach.call(els, ((el) => {
            el.width = '';
        }).bind(this));
        els = document.getElementsByClassName('ng2-smart-th');
        [].forEach.call(els, ((el) => {
            el.width = '';
        }).bind(this));
    }
    onResize(event) {
        if (this.grid.getSetting('infiniteScroll.display')) {
            this.resetColumnSize();
            this.resizeMultiHeads();
        }
    }
    ngOnChanges(changes) {
        if (this.grid) {
            if (changes['settings']) {
                this.grid.setSettings(this.prepareSettings());
            }
            if (changes['source']) {
                this.source = this.prepareSource();
                this.grid.setSource(this.source);
            }
        }
        else {
            this.initGrid();
        }
        this.tableId = this.grid.getSetting('attr.id');
        this.tableClass = this.grid.getSetting('attr.class');
        this.isHideHeader = this.grid.getSetting('hideHeader');
        this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
        this.isPagerDisplay = this.grid.getSetting('pager.display');
        this.isPagerDisplay = this.grid.getSetting('pager.display');
        this.perPageSelect = this.grid.getSetting('pager.perPageSelect');
        this.rowClassFunction = this.grid.getSetting('rowClassFunction');
    }
    ngOnDestroy() {
        this.destroyed$.next();
    }
    selectRow(index, switchPageToSelectedRowPage = this.grid.getSetting('switchPageToSelectedRowPage')) {
        if (!this.grid) {
            return;
        }
        this.grid.settings.selectedRowIndex = index;
        if (this.isIndexOutOfRange(index)) {
            // we need to deselect all rows if we got an incorrect index
            this.deselectAllRows();
            return;
        }
        if (switchPageToSelectedRowPage) {
            const source = this.source;
            const paging = source.getPaging();
            const page = getPageForRowIndex(index, paging.perPage);
            index = index % paging.perPage;
            this.grid.settings.selectedRowIndex = index;
            if (page !== paging.page) {
                source.setPage(page);
                return;
            }
        }
        const row = this.grid.getRows()[index];
        if (row) {
            this.onSelectRow(row);
        }
        else {
            // we need to deselect all rows if we got an incorrect index
            this.deselectAllRows();
        }
    }
    deselectAllRows() {
        this.grid.dataSet.deselectAll();
        this.emitDeselectRow(null);
    }
    editRowSelect(row) {
        if (this.grid.getSetting('selectMode') === 'multi') {
            this.onMultipleSelectRow(row);
        }
        else {
            this.onSelectRow(row);
        }
    }
    onUserSelectRow(row) {
        if (this.grid.getSetting('selectMode') !== 'multi') {
            this.grid.selectRow(row);
            this.emitUserSelectRow(row);
            this.emitSelectRow(row);
        }
    }
    onRowHover(row) {
        this.rowHover.emit(row);
    }
    multipleSelectRow(row) {
        this.grid.multipleSelectRow(row);
        this.emitUserSelectRow(row);
        this.emitSelectRow(row);
    }
    onSelectAllRows($event) {
        this.isAllSelected = !this.isAllSelected;
        this.grid.selectAllRows(this.isAllSelected);
        this.emitUserSelectRow(null);
        this.emitSelectRow(null);
    }
    onSelectRow(row) {
        this.grid.selectRow(row);
        this.emitSelectRow(row);
    }
    onMultipleSelectRow(row) {
        this.emitSelectRow(row);
    }
    initGrid() {
        this.source = this.prepareSource();
        this.grid = new Grid(this.source, this.prepareSettings());
        this.subscribeToOnSelectRow();
        this.subscribeToOnDeselectRow();
    }
    prepareSource() {
        if (this.source instanceof DataSource) {
            return this.source;
        }
        else if (this.source instanceof Array) {
            return new LocalDataSource(this.source);
        }
        return new LocalDataSource();
    }
    prepareSettings() {
        return deepExtend({}, this.defaultSettings, this.settings);
    }
    changePage($event) {
        this.resetAllSelector();
        this.emitPageChange($event);
    }
    sort($event) {
        this.resetAllSelector();
    }
    filter($event) {
        this.resetAllSelector();
    }
    resetAllSelector() {
        this.isAllSelected = false;
    }
    emitUserSelectRow(row) {
        const selectedRows = this.grid.getSelectedRows();
        this.userRowSelect.emit({
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
            isInEditing: row ? row.isInEditing : null,
            source: this.source,
            selected: selectedRows && selectedRows.length ? selectedRows.map((r) => r.getData()) : [],
        });
    }
    emitSelectRow(row) {
        const data = {
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
            source: this.source,
        };
        this.rowSelect.emit(data);
        if (!(row === null || row === void 0 ? void 0 : row.isSelected)) {
            this.rowDeselect.emit(data);
        }
    }
    emitDeselectRow(row) {
        this.rowDeselect.emit({
            data: row ? row.getData() : null,
            isSelected: row ? row.getIsSelected() : null,
            source: this.source,
        });
    }
    isIndexOutOfRange(index) {
        var _a;
        const dataAmount = (_a = this.source) === null || _a === void 0 ? void 0 : _a.count();
        return index < 0 || (typeof dataAmount === 'number' && index >= dataAmount);
    }
    subscribeToOnSelectRow() {
        if (this.onSelectRowSubscription) {
            this.onSelectRowSubscription.unsubscribe();
        }
        this.onSelectRowSubscription = this.grid.onSelectRow()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((row) => {
            this.emitSelectRow(row);
        });
    }
    subscribeToOnDeselectRow() {
        if (this.onDeselectRowSubscription) {
            this.onDeselectRowSubscription.unsubscribe();
        }
        this.onDeselectRowSubscription = this.grid.onDeselectRow()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((row) => {
            this.emitDeselectRow(row);
        });
    }
    emitPageChange($event) {
        this.pageChange.emit($event);
    }
}
Ng2SmartTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng2-smart-table',
                template: "  <table [id]=\"tableId\" [ngClass]=\"tableClass\">\n\n  <thead ng2-st-thead *ngIf=\"!isHideHeader || !isHideSubHeader\"\n                      [grid]=\"grid\"\n                      [isAllSelected]=\"isAllSelected\"\n                      [source]=\"source\"\n                      [createConfirm]=\"createConfirm\"\n                      (create)=\"create.emit($event)\"\n                      (createCancel)=\"createCancel.emit($event)\"\n                      (selectAllRows)=\"onSelectAllRows($event)\"\n                      (sort)=\"sort($event)\"\n                      (filter)=\"filter($event)\">\n  </thead>\n\n    <tbody *ngIf=\"!grid.getSetting('infiniteScroll.display')\" ng2-st-tbody [grid]=\"grid\"\n           [source]=\"source\"\n           [deleteConfirm]=\"deleteConfirm\"\n           [editConfirm]=\"editConfirm\"\n           [rowClassFunction]=\"rowClassFunction\"\n           (edit)=\"edit.emit($event)\"\n           (delete)=\"delete.emit($event)\"\n           (custom)=\"custom.emit($event)\"\n           (userSelectRow)=\"onUserSelectRow($event)\"\n           (editRowSelect)=\"editRowSelect($event)\"\n           (multipleSelectRow)=\"multipleSelectRow($event)\"\n           (rowHover)=\"onRowHover($event)\">\n    </tbody>\n\n  </table>\n\n  <cdk-virtual-scroll-viewport [itemSize]=\"grid.getSetting('infiniteScroll.itemSize')\" [className]=\"grid.getSetting('infiniteScroll.class')\" *ngIf=\"grid.getSetting('infiniteScroll.display')\">\n    <table [id]=\"tableId\" [ngClass]=\"tableClass\">\n      <thead ng2-st-thead *ngIf=\"!isHideHeader || !isHideSubHeader\"\n             [grid]=\"grid\"\n             [isAllSelected]=\"isAllSelected\"\n             [source]=\"source\"\n             [createConfirm]=\"createConfirm\"\n             (create)=\"create.emit($event)\"\n             (selectAllRows)=\"onSelectAllRows($event)\"\n             (sort)=\"sort($event)\"\n             (filter)=\"filter($event)\" class=\"ng2-smart-table-head-hidden\">\n      </thead>\n\n\n      <tbody ng2-st-tbody [grid]=\"grid\"\n                      [source]=\"source\"\n                      [deleteConfirm]=\"deleteConfirm\"\n                      [editConfirm]=\"editConfirm\"\n                      [rowClassFunction]=\"rowClassFunction\"\n                      (edit)=\"edit.emit($event)\"\n                      (cancel)=\"editCancel.emit($event)\"\n                      (delete)=\"delete.emit($event)\"\n                      (custom)=\"custom.emit($event)\"\n                      (userSelectRow)=\"onUserSelectRow($event)\"\n                      (editRowSelect)=\"editRowSelect($event)\"\n                      (multipleSelectRow)=\"multipleSelectRow($event)\"\n                      (rowHover)=\"onRowHover($event)\">\n    </tbody>\n    </table>\n  </cdk-virtual-scroll-viewport>\n\n\n<ng2-smart-table-pager *ngIf=\"isPagerDisplay\"\n                        [source]=\"source\"\n                        [perPageSelect]=\"perPageSelect\"\n                        (changePage)=\"changePage($event)\">\n</ng2-smart-table-pager>\n",
                styles: [":host{font-size:1rem}:host ::ng-deep *{box-sizing:border-box}:host ::ng-deep button,:host ::ng-deep input,:host ::ng-deep optgroup,:host ::ng-deep select,:host ::ng-deep textarea{color:inherit;font:inherit;margin:0}:host ::ng-deep .ng2-smart-table-default-infinite-scroll{overflow-y:scroll;min-height:30vh}:host ::ng-deep .ng2-smart-table-head-hidden{visibility:collapse}:host ::ng-deep .ng2-smart-table-head-hidden tr,:host ::ng-deep .ng2-smart-table-head-hidden tr th{height:0;line-height:0}:host ::ng-deep table{line-height:1.5em;border-collapse:collapse;border-spacing:0;display:table;width:100%;max-width:100%;overflow:auto;word-break:normal;word-break:keep-all}:host ::ng-deep table tr th{font-weight:700}:host ::ng-deep table tr section{font-size:.75em;font-weight:700}:host ::ng-deep table tr td,:host ::ng-deep table tr th{font-size:.875em;margin:0;padding:.5em 1em}:host ::ng-deep a{color:#1e6bb8;text-decoration:none}:host ::ng-deep a:hover{text-decoration:underline}"]
            },] }
];
Ng2SmartTableComponent.propDecorators = {
    source: [{ type: Input }],
    settings: [{ type: Input }],
    rowSelect: [{ type: Output }],
    rowDeselect: [{ type: Output }],
    userRowSelect: [{ type: Output }],
    pageChange: [{ type: Output }],
    delete: [{ type: Output }],
    edit: [{ type: Output }],
    editCancel: [{ type: Output }],
    create: [{ type: Output }],
    createCancel: [{ type: Output }],
    custom: [{ type: Output }],
    deleteConfirm: [{ type: Output }],
    editConfirm: [{ type: Output }],
    createConfirm: [{ type: Output }],
    rowHover: [{ type: Output }],
    onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXNtYXJ0LXRhYmxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1zbWFydC10YWJsZS9zcmMvbGliL25nMi1zbWFydC10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFlBQVksRUFJWixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTNELE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBUTVFLE1BQU0sT0FBTyxzQkFBc0I7SUFMbkM7UUFVWSxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNwQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdEMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3JDLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2pDLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQy9CLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3JDLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2pDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN2QyxXQUFNLEdBQUcsSUFBSSxZ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RyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sY0FBYyxDQUFDLE1BQVc7UUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBL1dGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUUzQixzL0ZBQStDOzthQUNoRDs7O3FCQUdFLEtBQUs7dUJBQ0wsS0FBSzt3QkFFTCxNQUFNOzBCQUNOLE1BQU07NEJBQ04sTUFBTTt5QkFDTixNQUFNO3FCQUNOLE1BQU07bUJBQ04sTUFBTTt5QkFDTixNQUFNO3FCQUNOLE1BQU07MkJBQ04sTUFBTTtxQkFDTixNQUFNOzRCQUNOLE1BQU07MEJBQ04sTUFBTTs0QkFDTixNQUFNO3VCQUNOLE1BQU07dUJBK0hOLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgSG9zdExpc3RlbmVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEdyaWQgfSBmcm9tICcuL2xpYi9ncmlkJztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICcuL2xpYi9kYXRhLXNvdXJjZS9kYXRhLXNvdXJjZSc7XG5pbXBvcnQgeyBSb3cgfSBmcm9tICcuL2xpYi9kYXRhLXNldC9yb3cnO1xuaW1wb3J0IHsgZGVlcEV4dGVuZCwgZ2V0UGFnZUZvclJvd0luZGV4IH0gZnJvbSAnLi9saWIvaGVscGVycyc7XG5pbXBvcnQgeyBMb2NhbERhdGFTb3VyY2UgfSBmcm9tICcuL2xpYi9kYXRhLXNvdXJjZS9sb2NhbC9sb2NhbC5kYXRhLXNvdXJjZSc7XG5pbXBvcnQgeyBOZzJTbWFydFRhYmxlU2V0dGluZ3MsIE5nMlNtYXJ0VGFibGVVc2VyUm93U2VsZWN0RXZlbnQgfSBmcm9tICcuL2xpYi9kYXRhLXNldHRpbmdzL2RhdGEtc2V0dGluZ3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZzItc21hcnQtdGFibGUnLFxuICBzdHlsZVVybHM6IFsnLi9uZzItc21hcnQtdGFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgdGVtcGxhdGVVcmw6ICcuL25nMi1zbWFydC10YWJsZS5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIE5nMlNtYXJ0VGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgc291cmNlOiBhbnk7XG4gIEBJbnB1dCgpIHNldHRpbmdzOiBOZzJTbWFydFRhYmxlU2V0dGluZ3MgfCBPYmplY3Q7XG5cbiAgQE91dHB1dCgpIHJvd1NlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcm93RGVzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHVzZXJSb3dTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHBhZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGRlbGV0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRpdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRpdENhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY3JlYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjcmVhdGVDYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGN1c3RvbSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZGVsZXRlQ29uZmlybSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRpdENvbmZpcm0gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGNyZWF0ZUNvbmZpcm0gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTsgIFxuICBAT3V0cHV0KCkgcm93SG92ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgdGFibGVDbGFzczogc3RyaW5nO1xuICB0YWJsZUlkOiBzdHJpbmc7XG4gIHBlclBhZ2VTZWxlY3Q6IGFueTtcbiAgaXNIaWRlSGVhZGVyOiBib29sZWFuO1xuICBpc0hpZGVTdWJIZWFkZXI6IGJvb2xlYW47XG4gIGlzUGFnZXJEaXNwbGF5OiBib29sZWFuO1xuICByb3dDbGFzc0Z1bmN0aW9uOiBGdW5jdGlvbjtcblxuICBncmlkOiBHcmlkO1xuICBkZWZhdWx0U2V0dGluZ3M6IE9iamVjdCA9IHtcbiAgICBtb2RlOiAnaW5saW5lJywgLy8gaW5saW5lfGV4dGVybmFsfGNsaWNrLXRvLWVkaXRcbiAgICBzZWxlY3RNb2RlOiAnc2luZ2xlJywgLy8gc2luZ2xlfG11bHRpXG4gICAgLyoqXG4gICAgICogUG9pbnRzIHRvIGFuIGVsZW1lbnQgaW4gYWxsIGRhdGFcbiAgICAgKlxuICAgICAqIHdoZW4gPCAwIGFsbCBsaW5lcyBtdXN0IGJlIGRlc2VsZWN0ZWRcbiAgICAgKi9cbiAgICBzZWxlY3RlZFJvd0luZGV4OiAwLFxuICAgIHN3aXRjaFBhZ2VUb1NlbGVjdGVkUm93UGFnZTogZmFsc2UsXG4gICAgaGlkZUhlYWRlcjogZmFsc2UsXG4gICAgaGlkZVN1YkhlYWRlcjogZmFsc2UsXG4gICAgYWN0aW9uczoge1xuICAgICAgY29sdW1uVGl0bGU6ICdBY3Rpb25zJyxcbiAgICAgIGFkZDogdHJ1ZSxcbiAgICAgIGVkaXQ6IHRydWUsXG4gICAgICBkZWxldGU6IHRydWUsXG4gICAgICBjdXN0b206IFtdLFxuICAgICAgcG9zaXRpb246ICdsZWZ0JywgLy8gbGVmdHxyaWdodFxuICAgIH0sXG4gICAgZmlsdGVyOiB7XG4gICAgICBpbnB1dENsYXNzOiAnJyxcbiAgICB9LFxuICAgIGVkaXQ6IHtcbiAgICAgIGlucHV0Q2xhc3M6ICcnLFxuICAgICAgZWRpdEJ1dHRvbkNvbnRlbnQ6ICdFZGl0JyxcbiAgICAgIHNhdmVCdXR0b25Db250ZW50OiAnVXBkYXRlJyxcbiAgICAgIGNhbmNlbEJ1dHRvbkNvbnRlbnQ6ICdDYW5jZWwnLFxuICAgICAgY29uZmlybVNhdmU6IGZhbHNlLFxuICAgIH0sXG4gICAgYWRkOiB7XG4gICAgICBpbnB1dENsYXNzOiAnJyxcbiAgICAgIGFkZEJ1dHRvbkNvbnRlbnQ6ICdBZGQgTmV3JyxcbiAgICAgIGNyZWF0ZUJ1dHRvbkNvbnRlbnQ6ICdDcmVhdGUnLFxuICAgICAgY2FuY2VsQnV0dG9uQ29udGVudDogJ0NhbmNlbCcsXG4gICAgICBjb25maXJtQ3JlYXRlOiBmYWxzZSxcbiAgICB9LFxuICAgIGRlbGV0ZToge1xuICAgICAgZGVsZXRlQnV0dG9uQ29udGVudDogJ0RlbGV0ZScsXG4gICAgICBjb25maXJtRGVsZXRlOiBmYWxzZSxcbiAgICB9LFxuICAgIGF0dHI6IHtcbiAgICAgIGlkOiAnJyxcbiAgICAgIGNsYXNzOiAnJyxcbiAgICB9LFxuICAgIG5vRGF0YU1lc3NhZ2U6ICdObyBkYXRhIGZvdW5kJyxcbiAgICBjb2x1bW5zOiB7fSxcbiAgICBwYWdlcjoge1xuICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgIHBhZ2U6IDEsXG4gICAgICBwZXJQYWdlOiAxMCxcbiAgICB9LFxuICAgIGluZmluaXRlU2Nyb2xsOiB7XG4gICAgICBkaXNwbGF5OiBmYWxzZSxcbiAgICAgIGl0ZW1TaXplOiAxMCxcbiAgICAgIGNsYXNzOiAnbmcyLXNtYXJ0LXRhYmxlLWRlZmF1bHQtaW5maW5pdGUtc2Nyb2xsJyxcbiAgICB9LFxuICAgIHJvd0NsYXNzRnVuY3Rpb246ICgpID0+ICcnLFxuICB9O1xuXG4gIGlzQWxsU2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIG9uU2VsZWN0Um93U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgb25EZXNlbGVjdFJvd1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGRlc3Ryb3llZCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5ncmlkLmdldFNldHRpbmcoJ2luZmluaXRlU2Nyb2xsLmRpc3BsYXknKSkge1xuICAgICAgdGhpcy5yZXNpemVNdWx0aUhlYWRzKCk7XG4gICAgfVxuICB9XG5cbiAgcmVzaXplTXVsdGlIZWFkcygpIHtcbiAgICBzZXRUaW1lb3V0KCAoKCkgPT4ge1xuICAgICAgbGV0IGVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ25nMi1zbWFydC1hY3Rpb25zJyk7XG4gICAgICAvKiBMZXQncyBkaXZpZGUgdGhlIGVsZW1lbnQgbGlzdCBieSAyLCB0aGUgICovXG4gICAgICBbXS5mb3JFYWNoLmNhbGwoZWxzLCAoIChlbCkgPT4ge1xuICAgICAgICAvKiBTZWFyY2ggZm9yIHRoZSBzYW1lIGVsZW1lbnQgaW5zaWRlIHRoZSBzYW1lIGFycmF5ICovXG4gICAgICAgIGNvbnN0IGN1cnJlbnRDbGFzc05hbWUgPSBlbC5jbGFzc05hbWU7XG4gICAgICAgIGxldCBlbGVtZW50V2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVscywgKCAob3RoZXJFbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKG90aGVyRWxlbWVudC5jbGFzc05hbWUgPT09IGVsLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgZWxlbWVudFdpZHRoID0gb3RoZXJFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBlbC53aWR0aCA9IGVsZW1lbnRXaWR0aDtcbiAgICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgICBlbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZzItc21hcnQtdGgnKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChlbHMsICggKGVsKSA9PiB7XG4gICAgICAgIC8qIFNlYXJjaCBmb3IgdGhlIHNhbWUgZWxlbWVudCBpbnNpZGUgdGhlIHNhbWUgYXJyYXkgKi9cbiAgICAgICAgY29uc3QgY3VycmVudENsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZTtcbiAgICAgICAgbGV0IGVsZW1lbnRXaWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZWxzLCAoIChvdGhlckVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAob3RoZXJFbGVtZW50LmNsYXNzTmFtZSA9PT0gZWwuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBlbGVtZW50V2lkdGggPSBvdGhlckVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIGVsLndpZHRoID0gZWxlbWVudFdpZHRoO1xuICAgICAgfSkuYmluZCh0aGlzKSk7XG5cbiAgICB9KSwgMTApO1xuICB9XG5cbiAgcmVzZXRDb2x1bW5TaXplKCkge1xuICAgIGxldCBlbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZzItc21hcnQtYWN0aW9ucycpO1xuICAgIFtdLmZvckVhY2guY2FsbChlbHMsICggKGVsKSA9PiB7XG4gICAgICBlbC53aWR0aCA9ICcnO1xuICAgIH0pLmJpbmQodGhpcykpO1xuXG4gICAgZWxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmcyLXNtYXJ0LXRoJyk7XG4gICAgW10uZm9yRWFjaC5jYWxsKGVscywgKCAoZWwpID0+IHtcbiAgICAgIGVsLndpZHRoID0gJyc7XG4gICAgfSkuYmluZCh0aGlzKSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgWyckZXZlbnQnXSlcbiAgb25SZXNpemUoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5ncmlkLmdldFNldHRpbmcoJ2luZmluaXRlU2Nyb2xsLmRpc3BsYXknKSkge1xuXG4gICAgICB0aGlzLnJlc2V0Q29sdW1uU2l6ZSgpO1xuICAgICAgdGhpcy5yZXNpemVNdWx0aUhlYWRzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcGVydHlOYW1lOiBzdHJpbmddOiBTaW1wbGVDaGFuZ2UgfSkge1xuICAgIGlmICh0aGlzLmdyaWQpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydzZXR0aW5ncyddKSB7XG4gICAgICAgIHRoaXMuZ3JpZC5zZXRTZXR0aW5ncyh0aGlzLnByZXBhcmVTZXR0aW5ncygpKTtcbiAgICAgIH1cbiAgICAgIGlmIChjaGFuZ2VzWydzb3VyY2UnXSkge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMucHJlcGFyZVNvdXJjZSgpO1xuICAgICAgICB0aGlzLmdyaWQuc2V0U291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0R3JpZCgpO1xuICAgIH1cbiAgICB0aGlzLnRhYmxlSWQgPSB0aGlzLmdyaWQuZ2V0U2V0dGluZygnYXR0ci5pZCcpO1xuICAgIHRoaXMudGFibGVDbGFzcyA9IHRoaXMuZ3JpZC5nZXRTZXR0aW5nKCdhdHRyLmNsYXNzJyk7XG4gICAgdGhpcy5pc0hpZGVIZWFkZXIgPSB0aGlzLmdyaWQuZ2V0U2V0dGluZygnaGlkZUhlYWRlcicpO1xuICAgIHRoaXMuaXNIaWRlU3ViSGVhZGVyID0gdGhpcy5ncmlkLmdldFNldHRpbmcoJ2hpZGVTdWJIZWFkZXInKTtcbiAgICB0aGlzLmlzUGFnZXJEaXNwbGF5ID0gdGhpcy5ncmlkLmdldFNldHRpbmcoJ3BhZ2VyLmRpc3BsYXknKTtcbiAgICB0aGlzLmlzUGFnZXJEaXNwbGF5ID0gdGhpcy5ncmlkLmdldFNldHRpbmcoJ3BhZ2VyLmRpc3BsYXknKTtcbiAgICB0aGlzLnBlclBhZ2VTZWxlY3QgPSB0aGlzLmdyaWQuZ2V0U2V0dGluZygncGFnZXIucGVyUGFnZVNlbGVjdCcpO1xuICAgIHRoaXMucm93Q2xhc3NGdW5jdGlvbiA9IHRoaXMuZ3JpZC5nZXRTZXR0aW5nKCdyb3dDbGFzc0Z1bmN0aW9uJyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3llZCQubmV4dCgpO1xuICB9XG5cbiAgc2VsZWN0Um93KGluZGV4OiBudW1iZXIsIHN3aXRjaFBhZ2VUb1NlbGVjdGVkUm93UGFnZTogYm9vbGVhbiA9IHRoaXMuZ3JpZC5nZXRTZXR0aW5nKCdzd2l0Y2hQYWdlVG9TZWxlY3RlZFJvd1BhZ2UnKSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5ncmlkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZ3JpZC5zZXR0aW5ncy5zZWxlY3RlZFJvd0luZGV4ID0gaW5kZXg7XG4gICAgaWYgKHRoaXMuaXNJbmRleE91dE9mUmFuZ2UoaW5kZXgpKSB7XG4gICAgICAvLyB3ZSBuZWVkIHRvIGRlc2VsZWN0IGFsbCByb3dzIGlmIHdlIGdvdCBhbiBpbmNvcnJlY3QgaW5kZXhcbiAgICAgIHRoaXMuZGVzZWxlY3RBbGxSb3dzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHN3aXRjaFBhZ2VUb1NlbGVjdGVkUm93UGFnZSkge1xuICAgICAgY29uc3Qgc291cmNlOiBEYXRhU291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgICBjb25zdCBwYWdpbmc6IHsgcGFnZTogbnVtYmVyLCBwZXJQYWdlOiBudW1iZXIgfSA9IHNvdXJjZS5nZXRQYWdpbmcoKTtcbiAgICAgIGNvbnN0IHBhZ2U6IG51bWJlciA9IGdldFBhZ2VGb3JSb3dJbmRleChpbmRleCwgcGFnaW5nLnBlclBhZ2UpO1xuICAgICAgaW5kZXggPSBpbmRleCAlIHBhZ2luZy5wZXJQYWdlO1xuICAgICAgdGhpcy5ncmlkLnNldHRpbmdzLnNlbGVjdGVkUm93SW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKHBhZ2UgIT09IHBhZ2luZy5wYWdlKSB7XG4gICAgICAgIHNvdXJjZS5zZXRQYWdlKHBhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBjb25zdCByb3c6IFJvdyA9IHRoaXMuZ3JpZC5nZXRSb3dzKClbaW5kZXhdO1xuICAgIGlmIChyb3cpIHtcbiAgICAgIHRoaXMub25TZWxlY3RSb3cocm93KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gd2UgbmVlZCB0byBkZXNlbGVjdCBhbGwgcm93cyBpZiB3ZSBnb3QgYW4gaW5jb3JyZWN0IGluZGV4XG4gICAgICB0aGlzLmRlc2VsZWN0QWxsUm93cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGVzZWxlY3RBbGxSb3dzKCk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZC5kYXRhU2V0LmRlc2VsZWN0QWxsKCk7XG4gICAgdGhpcy5lbWl0RGVzZWxlY3RSb3cobnVsbCk7XG4gIH1cblxuICBlZGl0Um93U2VsZWN0KHJvdzogUm93KSB7XG4gICAgaWYgKHRoaXMuZ3JpZC5nZXRTZXR0aW5nKCdzZWxlY3RNb2RlJykgPT09ICdtdWx0aScpIHtcbiAgICAgIHRoaXMub25NdWx0aXBsZVNlbGVjdFJvdyhyb3cpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uU2VsZWN0Um93KHJvdyk7XG4gICAgfVxuICB9XG5cbiAgb25Vc2VyU2VsZWN0Um93KHJvdzogUm93KSB7XG4gICAgaWYgKHRoaXMuZ3JpZC5nZXRTZXR0aW5nKCdzZWxlY3RNb2RlJykgIT09ICdtdWx0aScpIHtcbiAgICAgIHRoaXMuZ3JpZC5zZWxlY3RSb3cocm93KTtcbiAgICAgIHRoaXMuZW1pdFVzZXJTZWxlY3RSb3cocm93KTtcbiAgICAgIHRoaXMuZW1pdFNlbGVjdFJvdyhyb3cpO1xuICAgIH1cbiAgfVxuXG4gIG9uUm93SG92ZXIocm93OiBSb3cpIHtcbiAgICB0aGlzLnJvd0hvdmVyLmVtaXQocm93KTtcbiAgfVxuXG4gIG11bHRpcGxlU2VsZWN0Um93KHJvdzogUm93KSB7XG4gICAgdGhpcy5ncmlkLm11bHRpcGxlU2VsZWN0Um93KHJvdyk7XG4gICAgdGhpcy5lbWl0VXNlclNlbGVjdFJvdyhyb3cpO1xuICAgIHRoaXMuZW1pdFNlbGVjdFJvdyhyb3cpO1xuICB9XG5cbiAgb25TZWxlY3RBbGxSb3dzKCRldmVudDogYW55KSB7XG4gICAgdGhpcy5pc0FsbFNlbGVjdGVkID0gIXRoaXMuaXNBbGxTZWxlY3RlZDtcbiAgICB0aGlzLmdyaWQuc2VsZWN0QWxsUm93cyh0aGlzLmlzQWxsU2VsZWN0ZWQpO1xuXG4gICAgdGhpcy5lbWl0VXNlclNlbGVjdFJvdyhudWxsKTtcbiAgICB0aGlzLmVtaXRTZWxlY3RSb3cobnVsbCk7XG4gIH1cblxuICBvblNlbGVjdFJvdyhyb3c6IFJvdykge1xuICAgIHRoaXMuZ3JpZC5zZWxlY3RSb3cocm93KTtcbiAgICB0aGlzLmVtaXRTZWxlY3RSb3cocm93KTtcbiAgfVxuXG4gIG9uTXVsdGlwbGVTZWxlY3RSb3cocm93OiBSb3cpIHtcbiAgICB0aGlzLmVtaXRTZWxlY3RSb3cocm93KTtcbiAgfVxuXG4gIGluaXRHcmlkKCkge1xuICAgIHRoaXMuc291cmNlID0gdGhpcy5wcmVwYXJlU291cmNlKCk7XG4gICAgdGhpcy5ncmlkID0gbmV3IEdyaWQodGhpcy5zb3VyY2UsIHRoaXMucHJlcGFyZVNldHRpbmdzKCkpO1xuXG4gICAgdGhpcy5zdWJzY3JpYmVUb09uU2VsZWN0Um93KCk7XG4gICAgdGhpcy5zdWJzY3JpYmVUb09uRGVzZWxlY3RSb3coKTtcbiAgfVxuXG4gIHByZXBhcmVTb3VyY2UoKTogRGF0YVNvdXJjZSB7XG4gICAgaWYgKHRoaXMuc291cmNlIGluc3RhbmNlb2YgRGF0YVNvdXJjZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zb3VyY2UgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuIG5ldyBMb2NhbERhdGFTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTG9jYWxEYXRhU291cmNlKCk7XG4gIH1cblxuICBwcmVwYXJlU2V0dGluZ3MoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gZGVlcEV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xuICB9XG5cbiAgY2hhbmdlUGFnZSgkZXZlbnQ6IGFueSkge1xuICAgIHRoaXMucmVzZXRBbGxTZWxlY3RvcigpO1xuICAgIHRoaXMuZW1pdFBhZ2VDaGFuZ2UoJGV2ZW50KTtcbiAgfVxuXG4gIHNvcnQoJGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLnJlc2V0QWxsU2VsZWN0b3IoKTtcbiAgfVxuXG4gIGZpbHRlcigkZXZlbnQ6IGFueSkge1xuICAgIHRoaXMucmVzZXRBbGxTZWxlY3RvcigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldEFsbFNlbGVjdG9yKCkge1xuICAgIHRoaXMuaXNBbGxTZWxlY3RlZCA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0VXNlclNlbGVjdFJvdyhyb3c6IFJvdykge1xuICAgIGNvbnN0IHNlbGVjdGVkUm93cyA9IHRoaXMuZ3JpZC5nZXRTZWxlY3RlZFJvd3MoKTtcblxuICAgIHRoaXMudXNlclJvd1NlbGVjdC5lbWl0KHtcbiAgICAgIGRhdGE6IHJvdyA/IHJvdy5nZXREYXRhKCkgOiBudWxsLFxuICAgICAgaXNTZWxlY3RlZDogcm93ID8gcm93LmdldElzU2VsZWN0ZWQoKSA6IG51bGwsXG4gICAgICBpc0luRWRpdGluZzogcm93ID8gcm93LmlzSW5FZGl0aW5nIDogbnVsbCxcbiAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICBzZWxlY3RlZDogc2VsZWN0ZWRSb3dzICYmIHNlbGVjdGVkUm93cy5sZW5ndGggPyBzZWxlY3RlZFJvd3MubWFwKChyOiBSb3cpID0+IHIuZ2V0RGF0YSgpKSA6IFtdLFxuICAgIH0gYXMgTmcyU21hcnRUYWJsZVVzZXJSb3dTZWxlY3RFdmVudCk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRTZWxlY3RSb3cocm93OiBSb3cpIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgZGF0YTogcm93ID8gcm93LmdldERhdGEoKSA6IG51bGwsXG4gICAgICBpc1NlbGVjdGVkOiByb3cgPyByb3cuZ2V0SXNTZWxlY3RlZCgpIDogbnVsbCxcbiAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgfTtcbiAgICB0aGlzLnJvd1NlbGVjdC5lbWl0KGRhdGEpO1xuICAgIGlmICghcm93Py5pc1NlbGVjdGVkKSB7XG4gICAgICB0aGlzLnJvd0Rlc2VsZWN0LmVtaXQoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0RGVzZWxlY3RSb3cocm93OiBSb3cpOiB2b2lkIHtcbiAgICB0aGlzLnJvd0Rlc2VsZWN0LmVtaXQoe1xuICAgICAgZGF0YTogcm93ID8gcm93LmdldERhdGEoKSA6IG51bGwsXG4gICAgICBpc1NlbGVjdGVkOiByb3cgPyByb3cuZ2V0SXNTZWxlY3RlZCgpIDogbnVsbCxcbiAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGlzSW5kZXhPdXRPZlJhbmdlKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBkYXRhQW1vdW50OiBudW1iZXIgPSB0aGlzLnNvdXJjZT8uY291bnQoKTtcbiAgICByZXR1cm4gaW5kZXggPCAwIHx8ICh0eXBlb2YgZGF0YUFtb3VudCA9PT0gJ251bWJlcicgJiYgaW5kZXggPj0gZGF0YUFtb3VudCk7XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZVRvT25TZWxlY3RSb3coKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub25TZWxlY3RSb3dTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMub25TZWxlY3RSb3dTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5vblNlbGVjdFJvd1N1YnNjcmlwdGlvbiA9IHRoaXMuZ3JpZC5vblNlbGVjdFJvdygpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHJvdykgPT4ge1xuICAgICAgICB0aGlzLmVtaXRTZWxlY3RSb3cocm93KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVUb09uRGVzZWxlY3RSb3coKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub25EZXNlbGVjdFJvd1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5vbkRlc2VsZWN0Um93U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMub25EZXNlbGVjdFJvd1N1YnNjcmlwdGlvbiA9IHRoaXMuZ3JpZC5vbkRlc2VsZWN0Um93KClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpKVxuICAgICAgLnN1YnNjcmliZSgocm93KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdERlc2VsZWN0Um93KHJvdyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdFBhZ2VDaGFuZ2UoJGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLnBhZ2VDaGFuZ2UuZW1pdCgkZXZlbnQpO1xuICB9XG59XG4iXX0=