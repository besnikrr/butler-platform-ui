"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalPages = void 0;
const pagination_1 = require("../configs/pagination");
function getTotalPages(total, pageSize = pagination_1.PAGE_SIZE) {
    return Math.ceil(total / pageSize) || 1;
}
exports.getTotalPages = getTotalPages;
//# sourceMappingURL=pagination.js.map