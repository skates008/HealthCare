export class QueryResultsModel {
	// fields
	data: any[];
	total: number;
	errorMessage: string;

	constructor(_items: any[] = [], _total: number = 0, _errorMessage: string = '') {
		this.data = _items;
		this.total = _total;
	}
}
