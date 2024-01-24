"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFilters = void 0;
const qs = require("qs");
function parseFilters(filters) {
    if (!filters) {
        return "";
    }
    const filtersParsed = qs.parse(filters.replace("?", "").replace(/\|([^&]*)&?/g, "&"));
    return decodeURIComponent(qs.stringify(filtersParsed)).replace(/\|([^&]*)&?/g, "&");
}
exports.parseFilters = parseFilters;
//# sourceMappingURL=filters.js.map