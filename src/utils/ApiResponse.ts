import type { Response } from 'express';

class ApiResponse {
  public status: 'success' | 'error';
  public message: string;
  public data: unknown | null;
  public statusCode: number;

  // Constructor to initialize the ApiResponse
  constructor(
    status: 'success' | 'error',
    message: string,
    data: unknown | null,
    statusCode: number,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  // Static method to create a success response
  static success(
    res: Response,
    data: unknown | null = null,
    message: string,
    statusCode = 200,
  ): unknown {
    const response = new ApiResponse('success', message, data, statusCode);
    console.info(`API Response: ${JSON.stringify(response)}`);
    return res.status(response.statusCode).send(response);
  }

  // Static method to create an exception response
  static exception(
    res: Response,
    data: unknown | null = null,
    message: string = 'Internal Server Error',
    statusCode = 500,
  ): unknown {
    const errorDetails = {
      message: message,
      data: data,
      statusCode: statusCode,
    };

    // Log the error details
    console.error(`Error: ${JSON.stringify(errorDetails)}`);

    const response = new ApiResponse('error', message, data, statusCode);
    return res.status(response.statusCode).send(response);
  }

  // Static method to create an error response
  static error(
    res: Response,
    data: unknown | null = null,
    message: string = 'Bad Request',
    statusCode = 400,
  ): unknown {
    const errorDetails = {
      message: message,
      data: data,
      statusCode: statusCode,
    };

    // Log the error details
    console.error(`Error: ${JSON.stringify(errorDetails)}`);

    const response = new ApiResponse('error', message, data, statusCode);
    return res.status(response.statusCode).send(response);
  }
}
export default ApiResponse;
