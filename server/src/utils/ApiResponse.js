/**
 * Standardized API Response Class
 * Ensures consistent response format across all endpoints
 */
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  // Factory methods for common responses
  static success(data, message = "Success") {
    return new ApiResponse(200, message, data);
  }

  static created(data, message = "Created successfully") {
    return new ApiResponse(201, message, data);
  }

  static noContent(message = "No content") {
    return new ApiResponse(204, message);
  }

  /**
   * Send response to client
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponse;
