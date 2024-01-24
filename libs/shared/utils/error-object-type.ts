export interface ErrorObjectType {
  errorType: string;
  fault: string;
  httpCode: number;
  message: string;
  success: boolean;
  errors?: string[];
  stack?: any;
}
