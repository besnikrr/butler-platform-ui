import { PAGE_SIZE } from "../configs/pagination";

function getTotalPages(total: number, pageSize = PAGE_SIZE): number {
  return Math.ceil(total / pageSize) || 1;
}

export { getTotalPages };
