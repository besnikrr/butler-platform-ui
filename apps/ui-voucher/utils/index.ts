function isErrorType(error: unknown): error is Error {
  return error instanceof Error;
}

export { isErrorType };
