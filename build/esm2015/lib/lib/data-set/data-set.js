import { Row } from './row';
import { Column } from './column';
import { isEqual } from 'lodash';
export class DataSet {
    constructor(data = [], columnSettings) {
        this.columnSettings = columnSettings;
        this.data = [];
        this.columns = [];
        this.rows = [];
        this.createColumns(columnSettings);
        this.setData(data);
        this.createNewRow();
    }
    setData(data) {
        this.data = data;
        this.createRows();
    }
    getColumns() {
        return this.columns;
    }
    getRows() {
        return this.rows;
    }
    getFirstRow() {
        return this.rows[0];
    }
    getLastRow() {
        return this.rows[this.rows.length - 1];
    }
    findRowByData(data) {
        return this.rows.find((row) => isEqual(row.getData(), data));
    }
    deselectAll() {
        this.rows.forEach((row) => {
            row.isSelected = false;
        });
        // we need to clear selectedRow field because no one row selected
        this.selectedRow = undefined;
    }
    selectRow(row) {
        const previousIsSelected = row.isSelected;
        this.deselectAll();
        row.isSelected = !previousIsSelected;
        this.selectedRow = row;
        return this.selectedRow;
    }
    multipleSelectRow(row) {
        row.isSelected = !row.isSelected;
        this.selectedRow = row;
        return this.selectedRow;
    }
    selectPreviousRow() {
        if (this.rows.length > 0) {
            let index = this.selectedRow ? this.selectedRow.index : 0;
            if (index > this.rows.length - 1) {
                index = this.rows.length - 1;
            }
            this.selectRow(this.rows[index]);
            return this.selectedRow;
        }
    }
    selectFirstRow() {
        if (this.rows.length > 0) {
            this.selectRow(this.rows[0]);
            return this.selectedRow;
        }
    }
    selectLastRow() {
        if (this.rows.length > 0) {
            this.selectRow(this.rows[this.rows.length - 1]);
            return this.selectedRow;
        }
    }
    selectRowByIndex(index) {
        const rowsLength = this.rows.length;
        if (rowsLength === 0) {
            return;
        }
        if (!index) {
            this.selectFirstRow();
            return this.selectedRow;
        }
        if (index > 0 && index < rowsLength) {
            this.selectRow(this.rows[index]);
            return this.selectedRow;
        }
        // we need to deselect all rows if we got an incorrect index
        this.deselectAll();
    }
    willSelectFirstRow() {
        this.willSelect = 'first';
    }
    willSelectLastRow() {
        this.willSelect = 'last';
    }
    select(selectedRowIndex) {
        if (this.getRows().length === 0) {
            return;
        }
        if (this.willSelect) {
            if (this.willSelect === 'first') {
                this.selectFirstRow();
            }
            if (this.willSelect === 'last') {
                this.selectLastRow();
            }
            this.willSelect = '';
        }
        else {
            this.selectRowByIndex(selectedRowIndex);
        }
        return this.selectedRow;
    }
    createNewRow() {
        this.newRow = new Row(-1, {}, this);
        this.newRow.isInEditing = true;
    }
    /**
     * Create columns by mapping from the settings
     * @param settings
     * @private
     */
    createColumns(settings) {
        for (const id in settings) {
            if (settings.hasOwnProperty(id)) {
                this.columns.push(new Column(id, settings[id], this));
            }
        }
    }
    /**
     * Create rows based on current data prepared in data source
     * @private
     */
    createRows() {
        this.rows = [];
        this.data.forEach((el, index) => {
            this.rows.push(new Row(index, el, this));
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItc21hcnQtdGFibGUvc3JjL2xpYi9saWIvZGF0YS1zZXQvZGF0YS1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM1QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFakMsTUFBTSxPQUFPLE9BQU87SUFVbEIsWUFBWSxPQUFtQixFQUFFLEVBQVksY0FBc0I7UUFBdEIsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFOekQsU0FBSSxHQUFlLEVBQUUsQ0FBQztRQUN0QixZQUFPLEdBQWtCLEVBQUUsQ0FBQztRQUM1QixTQUFJLEdBQWUsRUFBRSxDQUFDO1FBSzlCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVuQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFnQjtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFN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YyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDdkQ7U0FDRjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3cgfSBmcm9tICcuL3Jvdyc7XG5pbXBvcnQgeyBDb2x1bW4gfSBmcm9tICcuL2NvbHVtbic7XG5pbXBvcnQgeyBpc0VxdWFsIH0gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGNsYXNzIERhdGFTZXQge1xuXG4gIG5ld1JvdzogUm93O1xuXG4gIHByb3RlY3RlZCBkYXRhOiBBcnJheTxhbnk+ID0gW107XG4gIHByb3RlY3RlZCBjb2x1bW5zOiBBcnJheTxDb2x1bW4+ID0gW107XG4gIHByb3RlY3RlZCByb3dzOiBBcnJheTxSb3c+ID0gW107XG4gIHByb3RlY3RlZCBzZWxlY3RlZFJvdzogUm93O1xuICBwcm90ZWN0ZWQgd2lsbFNlbGVjdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IEFycmF5PGFueT4gPSBbXSwgcHJvdGVjdGVkIGNvbHVtblNldHRpbmdzOiBPYmplY3QpIHtcbiAgICB0aGlzLmNyZWF0ZUNvbHVtbnMoY29sdW1uU2V0dGluZ3MpO1xuICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcblxuICAgIHRoaXMuY3JlYXRlTmV3Um93KCk7XG4gIH1cblxuICBzZXREYXRhKGRhdGE6IEFycmF5PGFueT4pIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuY3JlYXRlUm93cygpO1xuICB9XG5cbiAgZ2V0Q29sdW1ucygpOiBBcnJheTxDb2x1bW4+IHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5zO1xuICB9XG5cbiAgZ2V0Um93cygpOiBBcnJheTxSb3c+IHtcbiAgICByZXR1cm4gdGhpcy5yb3dzO1xuICB9XG5cbiAgZ2V0Rmlyc3RSb3coKTogUm93IHtcbiAgICByZXR1cm4gdGhpcy5yb3dzWzBdO1xuICB9XG5cbiAgZ2V0TGFzdFJvdygpOiBSb3cge1xuICAgIHJldHVybiB0aGlzLnJvd3NbdGhpcy5yb3dzLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgZmluZFJvd0J5RGF0YShkYXRhOiBhbnkpOiBSb3cge1xuICAgIHJldHVybiB0aGlzLnJvd3MuZmluZCgocm93OiBSb3cpID0+IGlzRXF1YWwocm93LmdldERhdGEoKSwgZGF0YSkpO1xuICB9XG5cbiAgZGVzZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5yb3dzLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgcm93LmlzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB9KTtcbiAgICAvLyB3ZSBuZWVkIHRvIGNsZWFyIHNlbGVjdGVkUm93IGZpZWxkIGJlY2F1c2Ugbm8gb25lIHJvdyBzZWxlY3RlZFxuICAgIHRoaXMuc2VsZWN0ZWRSb3cgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBzZWxlY3RSb3cocm93OiBSb3cpOiBSb3cgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHByZXZpb3VzSXNTZWxlY3RlZCA9IHJvdy5pc1NlbGVjdGVkO1xuICAgIHRoaXMuZGVzZWxlY3RBbGwoKTtcblxuICAgIHJvdy5pc1NlbGVjdGVkID0gIXByZXZpb3VzSXNTZWxlY3RlZDtcbiAgICB0aGlzLnNlbGVjdGVkUm93ID0gcm93O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRSb3c7XG4gIH1cblxuICBtdWx0aXBsZVNlbGVjdFJvdyhyb3c6IFJvdyk6IFJvdyB7XG4gICAgcm93LmlzU2VsZWN0ZWQgPSAhcm93LmlzU2VsZWN0ZWQ7XG4gICAgdGhpcy5zZWxlY3RlZFJvdyA9IHJvdztcblxuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUm93O1xuICB9XG5cbiAgc2VsZWN0UHJldmlvdXNSb3coKTogUm93IHtcbiAgICBpZiAodGhpcy5yb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuc2VsZWN0ZWRSb3cgPyB0aGlzLnNlbGVjdGVkUm93LmluZGV4IDogMDtcbiAgICAgIGlmIChpbmRleCA+IHRoaXMucm93cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGluZGV4ID0gdGhpcy5yb3dzLmxlbmd0aCAtIDE7XG4gICAgICB9XG4gICAgICB0aGlzLnNlbGVjdFJvdyh0aGlzLnJvd3NbaW5kZXhdKTtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUm93O1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEZpcnN0Um93KCk6IFJvdyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMucm93cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNlbGVjdFJvdyh0aGlzLnJvd3NbMF0pO1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRSb3c7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0TGFzdFJvdygpOiBSb3cgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLnJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZWxlY3RSb3codGhpcy5yb3dzW3RoaXMucm93cy5sZW5ndGggLSAxXSk7XG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvdztcbiAgICB9XG4gIH1cblxuICBzZWxlY3RSb3dCeUluZGV4KGluZGV4OiBudW1iZXIpOiBSb3cgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHJvd3NMZW5ndGg6IG51bWJlciA9IHRoaXMucm93cy5sZW5ndGg7XG4gICAgaWYgKHJvd3NMZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFpbmRleCkge1xuICAgICAgdGhpcy5zZWxlY3RGaXJzdFJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRSb3c7XG4gICAgfVxuICAgIGlmIChpbmRleCA+IDAgJiYgaW5kZXggPCByb3dzTGVuZ3RoKSB7XG4gICAgICB0aGlzLnNlbGVjdFJvdyh0aGlzLnJvd3NbaW5kZXhdKTtcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUm93O1xuICAgIH1cbiAgICAvLyB3ZSBuZWVkIHRvIGRlc2VsZWN0IGFsbCByb3dzIGlmIHdlIGdvdCBhbiBpbmNvcnJlY3QgaW5kZXhcbiAgICB0aGlzLmRlc2VsZWN0QWxsKCk7XG4gIH1cblxuICB3aWxsU2VsZWN0Rmlyc3RSb3coKSB7XG4gICAgdGhpcy53aWxsU2VsZWN0ID0gJ2ZpcnN0JztcbiAgfVxuXG4gIHdpbGxTZWxlY3RMYXN0Um93KCkge1xuICAgIHRoaXMud2lsbFNlbGVjdCA9ICdsYXN0JztcbiAgfVxuXG4gIHNlbGVjdChzZWxlY3RlZFJvd0luZGV4PzogbnVtYmVyKTogUm93IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5nZXRSb3dzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLndpbGxTZWxlY3QpIHtcbiAgICAgIGlmICh0aGlzLndpbGxTZWxlY3QgPT09ICdmaXJzdCcpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RGaXJzdFJvdygpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMud2lsbFNlbGVjdCA9PT0gJ2xhc3QnKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0TGFzdFJvdygpO1xuICAgICAgfVxuICAgICAgdGhpcy53aWxsU2VsZWN0ID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0Um93QnlJbmRleChzZWxlY3RlZFJvd0luZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvdztcbiAgfVxuXG4gIGNyZWF0ZU5ld1JvdygpIHtcbiAgICB0aGlzLm5ld1JvdyA9IG5ldyBSb3coLTEsIHt9LCB0aGlzKTtcbiAgICB0aGlzLm5ld1Jvdy5pc0luRWRpdGluZyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGNvbHVtbnMgYnkgbWFwcGluZyBmcm9tIHRoZSBzZXR0aW5nc1xuICAgKiBAcGFyYW0gc2V0dGluZ3NcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNyZWF0ZUNvbHVtbnMoc2V0dGluZ3M6IGFueSkge1xuICAgIGZvciAoY29uc3QgaWQgaW4gc2V0dGluZ3MpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zLnB1c2gobmV3IENvbHVtbihpZCwgc2V0dGluZ3NbaWRdLCB0aGlzKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSByb3dzIGJhc2VkIG9uIGN1cnJlbnQgZGF0YSBwcmVwYXJlZCBpbiBkYXRhIHNvdXJjZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlUm93cygpIHtcbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZWwsIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLnJvd3MucHVzaChuZXcgUm93KGluZGV4LCBlbCwgdGhpcykpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=