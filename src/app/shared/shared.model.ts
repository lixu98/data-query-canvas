// 分页器
export class Pagination {
    page: number;
    limit: number;
    total: number;
    constructor() {
        return {
            page: 1,
            limit: 10,
            total: 0,
        }
    }
}