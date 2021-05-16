export function filterValues(value, search) {
    return value.toString().toLowerCase().includes(search.toString().toLowerCase());
}
export class LocalFilter {
    static filter(data, field, search, customFilter) {
        const filter = customFilter ? customFilter : filterValues;
        return data.filter((el) => {
            const value = typeof el[field] === 'undefined' || el[field] === null ? '' : el[field];
            return filter.call(null, value, search);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwuZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmcyLXNtYXJ0LXRhYmxlL3NyYy9saWIvbGliL2RhdGEtc291cmNlL2xvY2FsL2xvY2FsLmZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsWUFBWSxDQUFDLEtBQWEsRUFBRSxNQUFjO0lBQ3hELE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNsRixDQUFDO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFFdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFnQixFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQUUsWUFBdUI7UUFDcEYsTUFBTSxNQUFNLEdBQWEsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUVwRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtZQUN4QixNQUFNLEtBQUssR0FBRyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxXQUFXLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZmlsdGVyVmFsdWVzKHZhbHVlOiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nKSB7XG4gIHJldHVybiB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbEZpbHRlciB7XG5cbiAgc3RhdGljIGZpbHRlcihkYXRhOiBBcnJheTxhbnk+LCBmaWVsZDogc3RyaW5nLCBzZWFyY2g6IHN0cmluZywgY3VzdG9tRmlsdGVyPzogRnVuY3Rpb24pOiBBcnJheTxhbnk+IHtcbiAgICBjb25zdCBmaWx0ZXI6IEZ1bmN0aW9uID0gY3VzdG9tRmlsdGVyID8gY3VzdG9tRmlsdGVyIDogZmlsdGVyVmFsdWVzO1xuXG4gICAgcmV0dXJuIGRhdGEuZmlsdGVyKChlbCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSB0eXBlb2YgZWxbZmllbGRdID09PSAndW5kZWZpbmVkJyB8fCBlbFtmaWVsZF0gPT09IG51bGwgPyAnJyA6IGVsW2ZpZWxkXTtcbiAgICAgIHJldHVybiBmaWx0ZXIuY2FsbChudWxsLCB2YWx1ZSwgc2VhcmNoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19