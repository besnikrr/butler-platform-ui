import { PaginationItemType } from './';

const getRange = (start: number, end: number, pageBufferSize = 2) => {
  const numVisiblePages = 2 * pageBufferSize + 1;
  const pagination: PaginationItemType[] = [];
  // Calculate left and right range
  let left = Math.max(1, start - pageBufferSize);
  let right = Math.min(start + pageBufferSize, end);
  if (start - 1 <= pageBufferSize) {
    right = 1 + pageBufferSize * 2;
  }
  if (end - start <= pageBufferSize) {
    left = end - pageBufferSize * 2;
  }
  if (end <= numVisiblePages) {
    left = 1;
    right = end;
  }
  // Calculate dots
  const hasLeftDots = start - pageBufferSize > 1 && left !== 2 && end > numVisiblePages;
  const hasRightDots = start + pageBufferSize < end && end - 1 !== right && end > numVisiblePages;
  // Add pages
  if (left > 1) {
    pagination.push({ page: 1, type: 'page' });
  }
  if (hasLeftDots) {
    pagination.push({ type: 'dots', direction: 'left', page: -1 });
  }
  for (let i = left; i <= right; i += 1) {
    pagination.push({ page: i, type: 'page' });
  }
  if (hasRightDots) {
    pagination.splice(end - 1, 0, { type: 'dots', direction: 'right', page: -1 });
  }
  if (end > right) {
    pagination.push({ page: end, type: 'page' });
  }
  return pagination;
};

export default getRange;
