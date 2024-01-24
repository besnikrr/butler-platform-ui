function isErrorType(error: unknown): error is Error {
  return error instanceof Error;
}

const formatTaxRate = (taxRate?: number) => {
  if (taxRate) {
    if (taxRate % 1 === 0) {
      return Number(taxRate).toFixed();
    }
    return taxRate;
  }
  return "n/a";
};

export { isErrorType, formatTaxRate };
