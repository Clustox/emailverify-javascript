const BASE_URL = "https://app.emailverify.io/api/v1";

// Custom Error class for API errors
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Export the ApiError class so it can be used by consumers
export { ApiError };

export function parameterIsMissing(parameter, message = null) {
  console.error(
    `${parameter} is required.`
  );
}

export function notInitialized() {
  console.error("EmailVerify: Call init function first with a valid api key.");
}

export async function createRequest({ requestType, params, path, body = null }) {
  const url = new URL(BASE_URL + path);
  
  // Add query parameters for GET requests
  if (requestType === "GET" && params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
  }

  const requestOptions = {
    method: requestType,
    headers: {
      'Content-Type': requestType === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded',
    },
  };

  // Add body for POST requests
  if (requestType === "POST" && body) {
    requestOptions.body = body;
  }

  try {
    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      // Try to get error details from response
      let errorData;
      try {
        const errorBody = await response.text();
        try {
          errorData = JSON.parse(errorBody);
        } catch (e) {
          errorData = { error: errorBody || `HTTP ${response.status}` };
        }
      } catch (e) {
        errorData = { error: `HTTP error! status: ${response.status}` };
      }
      
      const apiError = new ApiError(
        errorData?.error || 'Unknown error', 
        response.status,                      
        errorData                           
      );
      
      throw apiError;
    }
    
    const data = await response.json();
    return data;    
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error);
  }
}
