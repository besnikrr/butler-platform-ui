const getTableName = (
  tenantId: string,
  tableName = null
): string | undefined => {
  return tableName || `${process.env.TABLE}-${process.env.STAGE}-${tenantId}`;
};
export { getTableName };
