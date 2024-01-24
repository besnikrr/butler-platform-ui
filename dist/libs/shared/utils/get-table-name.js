"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTableName = void 0;
const getTableName = (tenantId, tableName = null) => {
    return tableName || `${process.env.TABLE}-${process.env.STAGE}-${tenantId}`;
};
exports.getTableName = getTableName;
//# sourceMappingURL=get-table-name.js.map