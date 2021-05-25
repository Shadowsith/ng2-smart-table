import { Subject } from 'rxjs';
export class DataSource {
    constructor() {
        this.onChangedSource = new Subject();
        this.onAddedSource = new Subject();
        this.onUpdatedSource = new Subject();
        this.onRemovedSource = new Subject();
    }
    refresh() {
        this.emitOnChanged('refresh');
    }
    load(data) {
        this.emitOnChanged('load');
        return Promise.resolve();
    }
    onChanged() {
        return this.onChangedSource.asObservable();
    }
    onAdded() {
        return this.onAddedSource.asObservable();
    }
    onUpdated() {
        return this.onUpdatedSource.asObservable();
    }
    onRemoved() {
        return this.onRemovedSource.asObservable();
    }
    prepend(element) {
        this.emitOnAdded(element);
        this.emitOnChanged('prepend');
        return Promise.resolve();
    }
    append(element) {
        this.emitOnAdded(element);
        this.emitOnChanged('append');
        return Promise.resolve();
    }
    add(element) {
        this.emitOnAdded(element);
        this.emitOnChanged('add');
        return Promise.resolve();
    }
    remove(element) {
        this.emitOnRemoved(element);
        this.emitOnChanged('remove');
        return Promise.resolve();
    }
    update(element, values) {
        this.emitOnUpdated(element);
        this.emitOnChanged('update');
        return Promise.resolve();
    }
    empty() {
        this.emitOnChanged('empty');
        return Promise.resolve();
    }
    setSort(conf, doEmit) {
        if (doEmit) {
            this.emitOnChanged('sort');
        }
    }
    setFilter(conf, andOperator, doEmit) {
        if (doEmit) {
            this.emitOnChanged('filter');
        }
    }
    addFilter(fieldConf, andOperator, doEmit) {
        if (doEmit) {
            this.emitOnChanged('filter');
        }
    }
    setPaging(page, perPage, doEmit) {
        if (doEmit) {
            this.emitOnChanged('paging');
        }
    }
    setPage(page, doEmit) {
        if (doEmit) {
            this.emitOnChanged('page');
        }
    }
    emitOnRemoved(element) {
        this.onRemovedSource.next(element);
    }
    emitOnUpdated(element) {
        this.onUpdatedSource.next(element);
    }
    emitOnAdded(element) {
        this.onAddedSource.next(element);
    }
    emitOnChanged(action) {
        this.getElements().then((elements) => this.onChangedSource.next({
            action: action,
            elements: elements,
            paging: this.getPaging(),
            filter: this.getFilter(),
            sort: this.getSort(),
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItc21hcnQtdGFibGUvc3JjL2xpYi9saWIvZGF0YS1zb3VyY2UvZGF0YS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixNQUFNLE9BQWdCLFVBQVU7SUFBaEM7UUFDWSxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDckMsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBQ25DLG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNyQyxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7SUF3SGpELENBQUM7SUEvR0MsT0FBTztRQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFnQjtRQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBWTtRQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFC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Q3hCLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO1NBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0YVNvdXJjZSB7XG4gIHByb3RlY3RlZCBvbkNoYW5nZWRTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIHByb3RlY3RlZCBvbkFkZGVkU291cmNlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcm90ZWN0ZWQgb25VcGRhdGVkU291cmNlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcm90ZWN0ZWQgb25SZW1vdmVkU291cmNlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gIGFic3RyYWN0IGdldEFsbCgpOiBQcm9taXNlPGFueT47XG4gIGFic3RyYWN0IGdldEVsZW1lbnRzKCk6IFByb21pc2U8YW55PjtcbiAgYWJzdHJhY3QgZ2V0U29ydCgpOiBhbnk7XG4gIGFic3RyYWN0IGdldEZpbHRlcigpOiBhbnk7XG4gIGFic3RyYWN0IGdldFBhZ2luZygpOiBhbnk7XG4gIGFic3RyYWN0IGNvdW50KCk6IG51bWJlcjtcblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZW1pdE9uQ2hhbmdlZCgncmVmcmVzaCcpO1xuICB9XG5cbiAgbG9hZChkYXRhOiBBcnJheTxhbnk+KTogUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLmVtaXRPbkNoYW5nZWQoJ2xvYWQnKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBvbkNoYW5nZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5vbkNoYW5nZWRTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBvbkFkZGVkKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub25BZGRlZFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG9uVXBkYXRlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLm9uVXBkYXRlZFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG9uUmVtb3ZlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLm9uUmVtb3ZlZFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHByZXBlbmQoZWxlbWVudDogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLmVtaXRPbkFkZGVkKGVsZW1lbnQpO1xuICAgIHRoaXMuZW1pdE9uQ2hhbmdlZCgncHJlcGVuZCcpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGFwcGVuZChlbGVtZW50OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMuZW1pdE9uQWRkZWQoZWxlbWVudCk7XG4gICAgdGhpcy5lbWl0T25DaGFuZ2VkKCdhcHBlbmQnKTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBhZGQoZWxlbWVudDogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICB0aGlzLmVtaXRPbkFkZGVkKGVsZW1lbnQpO1xuICAgIHRoaXMuZW1pdE9uQ2hhbmdlZCgnYWRkJyk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgcmVtb3ZlKGVsZW1lbnQ6IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgdGhpcy5lbWl0T25SZW1vdmVkKGVsZW1lbnQpO1xuICAgIHRoaXMuZW1pdE9uQ2hhbmdlZCgncmVtb3ZlJyk7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgdXBkYXRlKGVsZW1lbnQ6IGFueSwgdmFsdWVzOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgIHRoaXMuZW1pdE9uVXBkYXRlZChlbGVtZW50KTtcbiAgICB0aGlzLmVtaXRPbkNoYW5nZWQoJ3VwZGF0ZScpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIGVtcHR5KCk6IFByb21pc2U8YW55PiB7XG4gICAgdGhpcy5lbWl0T25DaGFuZ2VkKCdlbXB0eScpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIHNldFNvcnQoY29uZjogQXJyYXk8YW55PiwgZG9FbWl0PzogYm9vbGVhbikge1xuICAgIGlmIChkb0VtaXQpIHtcbiAgICAgIHRoaXMuZW1pdE9uQ2hhbmdlZCgnc29ydCcpO1xuICAgIH1cbiAgfVxuXG4gIHNldEZpbHRlcihjb25mOiBBcnJheTxhbnk+LCBhbmRPcGVyYXRvcj86IGJvb2xlYW4sIGRvRW1pdD86IGJvb2xlYW4pIHtcbiAgICBpZiAoZG9FbWl0KSB7XG4gICAgICB0aGlzLmVtaXRPbkNoYW5nZWQoJ2ZpbHRlcicpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEZpbHRlcihmaWVsZENvbmY6IHt9LCBhbmRPcGVyYXRvcj86IGJvb2xlYW4sIGRvRW1pdD86IGJvb2xlYW4pIHtcbiAgICBpZiAoZG9FbWl0KSB7XG4gICAgICB0aGlzLmVtaXRPbkNoYW5nZWQoJ2ZpbHRlcicpO1xuICAgIH1cbiAgfVxuXG4gIHNldFBhZ2luZyhwYWdlOiBudW1iZXIsIHBlclBhZ2U6IG51bWJlciwgZG9FbWl0PzogYm9vbGVhbikge1xuICAgIGlmIChkb0VtaXQpIHtcbiAgICAgIHRoaXMuZW1pdE9uQ2hhbmdlZCgncGFnaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0UGFnZShwYWdlOiBudW1iZXIsIGRvRW1pdD86IGJvb2xlYW4pIHtcbiAgICBpZiAoZG9FbWl0KSB7XG4gICAgICB0aGlzLmVtaXRPbkNoYW5nZWQoJ3BhZ2UnKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZW1pdE9uUmVtb3ZlZChlbGVtZW50OiBhbnkpIHtcbiAgICB0aGlzLm9uUmVtb3ZlZFNvdXJjZS5uZXh0KGVsZW1lbnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGVtaXRPblVwZGF0ZWQoZWxlbWVudDogYW55KSB7XG4gICAgdGhpcy5vblVwZGF0ZWRTb3VyY2UubmV4dChlbGVtZW50KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBlbWl0T25BZGRlZChlbGVtZW50OiBhbnkpIHtcbiAgICB0aGlzLm9uQWRkZWRTb3VyY2UubmV4dChlbGVtZW50KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBlbWl0T25DaGFuZ2VkKGFjdGlvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5nZXRFbGVtZW50cygpLnRoZW4oKGVsZW1lbnRzKSA9PiB0aGlzLm9uQ2hhbmdlZFNvdXJjZS5uZXh0KHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgZWxlbWVudHM6IGVsZW1lbnRzLFxuICAgICAgcGFnaW5nOiB0aGlzLmdldFBhZ2luZygpLFxuICAgICAgZmlsdGVyOiB0aGlzLmdldEZpbHRlcigpLFxuICAgICAgc29ydDogdGhpcy5nZXRTb3J0KCksXG4gICAgfSkpO1xuICB9XG59XG4iXX0=