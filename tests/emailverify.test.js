import { EmailVerifySDK } from '../src/emailverify.js';

// Mock fetch for testing
global.fetch = jest.fn();

describe('EmailVerifySDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new EmailVerifySDK();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize with API key', () => {
      const apiKey = 'test-api-key';
      sdk.init(apiKey);
      expect(sdk._initialized).toBe(true);
      expect(sdk._api_key).toBe(apiKey);
    });

    test('should handle missing API key', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      sdk.init('');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Api key is required')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('validateEmail', () => {
    beforeEach(() => {
      sdk.init('test-api-key');
    });

    test('should validate email successfully', async () => {
      const mockResponse = {
        email: 'test@example.com',
        status: 'valid',
        sub_status: 'permitted'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sdk.validateEmail('test@example.com');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/validate'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle missing email parameter', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      sdk.validateEmail('');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Email is required')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('checkAccountBalance', () => {
    beforeEach(() => {
      sdk.init('test-api-key');
    });

    test('should check account balance successfully', async () => {
      const mockResponse = {
        api_status: 'enabled',
        daily_credits_limit: 150,
        referral_credits: 100,
        remaining_credits: 15000
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sdk.checkAccountBalance();
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/check-account-balance/'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('validateBatch', () => {
    beforeEach(() => {
      sdk.init('test-api-key');
    });

    test('should validate batch successfully', async () => {
      const mockResponse = {
        status: 'queued',
        task_id: '12345',
        count_submitted: 3,
        count_duplicates_removed: 0,
        count_rejected_emails: 0,
        count_processing: 3
      };

      const emailBatch = [
        { address: 'test1@example.com' },
        { address: 'test2@example.com' },
        { address: 'test3@example.com' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sdk.validateBatch('Test Task', emailBatch);
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/validate-batch'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test-api-key')
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle missing title parameter', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      sdk.validateBatch('', []);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Title is required')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('getBulkResults', () => {
    beforeEach(() => {
      sdk.init('test-api-key');
    });

    test('should get bulk results successfully', async () => {
      const mockResponse = {
        count_checked: 1,
        count_total: 1,
        name: 'Task Name',
        progress_percentage: '100%',
        task_id: '1234',
        status: 'verified',
        results: {
          email_batch: [
            {
              address: 'valid@example.com',
              status: 'invalid',
              sub_status: 'No dns entries'
            }
          ]
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sdk.getBulkResults('1234');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/get-result-bulk-verification-task'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findEmail', () => {
    beforeEach(() => {
      sdk.init('test-api-key');
    });

    test('should find email successfully', async () => {
      const mockResponse = {
        email: 'john123@gmail.com',
        status: 'found'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sdk.findEmail('John', 'example.com');
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/finder'),
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should handle email not found', async () => {
      const mockResponse = {
        email: 'null',
        status: 'not_found'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await sdk.findEmail('John', 'example.com');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      sdk.init('test-api-key');
    });

    test('should handle API errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(sdk.validateEmail('test@example.com'))
        .rejects
        .toThrow('Network error');
    });

    test('should handle HTTP errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValue('Unauthorized')
      });

      await expect(sdk.validateEmail('test@example.com'))
        .rejects
        .toThrow('Unauthorized');
    });
  });
});
