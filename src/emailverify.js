import { createRequest, notInitialized, parameterIsMissing } from "./utils.js";

export class EmailVerifySDK {
  constructor() {
    this._initialized = false;
    this._api_key = null;
  }

  /**
   * @param apiKey - your private API key
   * */
  init(apiKey) {
    if (!apiKey) {
      parameterIsMissing("Api key");
    } else {
      this._api_key = apiKey;
      this._initialized = true;
    }
  }

  /**
   * Validate a single email address
   * @param email - email to be validated
   * @returns {Promise} - API response with validation results
   * */
  validateEmail(email) {
    if (!this._initialized) {
      notInitialized();
      return;
    } else if (!email) {
      parameterIsMissing("Email");
      return;
    }

    const params = {
      key: this._api_key,
      email: email,
    };

    return createRequest({ 
      requestType: "GET", 
      params, 
      path: "/validate" 
    });
  }

  /**
   * Check account balance and limits
   * @returns {Promise} - API response with account balance information
   * */
  checkAccountBalance() {
    if (!this._initialized) {
      notInitialized();
      return;
    }

    const params = {
      key: this._api_key,
    };

    return createRequest({ 
      requestType: "GET", 
      params, 
      path: "/check-account-balance/" 
    });
  }

  /**
   * Validate batch of emails (up to 5000)
   * @param title - Task name for the batch
   * @param emailBatch - Array of email objects {address: "email@example.com"}
   * @returns {Promise} - API response with task information
   * */
  validateBatch(title, emailBatch) {
    if (!this._initialized) {
      notInitialized();
      return;
    } else if (!title) {
      parameterIsMissing("Title");
      return;
    } else if (!emailBatch || !Array.isArray(emailBatch)) {
      parameterIsMissing("Email batch");
      return;
    }

    const body = JSON.stringify({
      title: title,
      key: this._api_key,
      email_batch: emailBatch,
    });

    return createRequest({
      requestType: "POST",
      path: "/validate-batch",
      body: body
    });
  }

  /**
   * Get results of bulk verification task
   * @param taskId - The task ID from the batch validation
   * @returns {Promise} - API response with batch validation results
   * */
  getBulkResults(taskId) {
    if (!this._initialized) {
      notInitialized();
      return;
    } else if (!taskId) {
      parameterIsMissing("Task ID");
      return;
    }

    const params = {
      key: this._api_key,
      task_id: taskId,
    };

    return createRequest({
      requestType: "GET",
      params,
      path: "/get-result-bulk-verification-task",
      batch: true,
    });
  }

  /**
   * Find email using name and domain
   * @param name - First name of the person
   * @param domain - Domain name (e.g., example.com)
   * @returns {Promise} - API response with found email or not found status
   * */
  findEmail(name, domain) {
    if (!this._initialized) {
      notInitialized();
      return;
    } else if (!name) {
      parameterIsMissing("Name");
      return;
    } else if (!domain) {
      parameterIsMissing("Domain");
      return;
    }

    const params = {
      key: this._api_key,
      name: name,
      domain: domain,
    };

    return createRequest({
      requestType: "GET",
      params,
      path: "/finder",
    });
  }
}
