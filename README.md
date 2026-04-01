# EmailVerify.io JavaScript SDK [![Get API Key](https://img.shields.io/badge/Get-API%20Key-blue)](https://emailverify.io)

🚀 Official Node.js client for EmailVerify.io — fast and accurate email verification API.

- Validate emails in real-time
- Detect disposable & risky emails
- Run bulk verification
- Find professional email addresses

👉 Get free API key: https://emailverify.io

## Why EmailVerify.io?

- ⚡ Sub-100ms API response
- 🎯 High accuracy (SMTP-level verification)
- 💰 10x more cost-effective vs competitors
- 🔌 Works across Node.js, Python, PHP, Ruby, Go, .NET

## WE DO NOT RECOMMEND USING THIS SDK ON A FRONT-END ENVIRONMENT AS THE API KEY WILL BE VISIBLE

## INSTALLATION

```bash
npm install @emailverifyio/emailverify-sdk
```

## USAGE

Add the script

```HTML
<script src="<PATH_TO_SCRIPT/emailVerifySDK.js"></script>
```

```HTML
<script>
const emailVerify = new EmailVerifySDK();
</script>
```

OR

Add npm module

```javascript
const emailVerifySDK = require('@emailverifyio/emailverify-sdk')

const emailVerify = new emailVerifySDK();
```

Initialize the sdk with your api key generated from emailverify.io:

```javascript
emailVerify.init("<YOUR_API_KEY>");
```

NOTE: all the methods are asynchronous they have to be used with async / await or .then.catch

## Examples

Then you can use any of the SDK methods, for example:

- ##### Check How many credits you have left on your account

```javascript
try {
  const balance = await emailVerify.checkAccountBalance();
} catch (error) {
  console.error(error);
}
```

- ##### Validate an email address

Validates a single email address and get detailed information about its validity.

```javascript
try {
  const response = await emailVerify.validateEmail('<EMAIL_ADDRESS>'); // The email address you want to validate
} catch (error) {
  console.error(error);
}
```

- ##### Batch Email Validation

Validate emails in a single request.

```javascript
const emailBatch = [
  { address: "valid@example.com" },
  { address: "invalid@example.com" },
  { address: "test@example.com" }
];

try {
  const batchResult = await emailVerify.validateBatch("<TITLE>", emailBatch); // Title will be name of task
} catch (error) {
  console.error(error);
}
```

Save task_id from batchResult to retrieve results later

- ##### Get Batch Results

Retrieve the results of a previously submitted batch validation task.

```javascript
try {
    const taskResults = await emailVerify.getBulkResults('<TASK_ID>'); //task_id you receive in validateBatch result
} catch (error) {
  console.error(error);
}
```

- ##### Email Finder

Find email addresses using a person's name and domain.

```javascript
try {
   const foundEmail = await emailVerify.findEmail("<NAME>", "<DOMAIN.COM>"); 
} catch (error) {
  console.error(error);
}
```
## Complete Example

```javascript
const EmailVerifySDK = require('@emailverifyio/emailverify-sdk');

async function example() {
  const emailVerify = new EmailVerifySDK();
  emailVerify.init('<API_KEY>');

  try {
    // Check account balance
    const balance = await emailVerify.checkAccountBalance();
    console.log('Account Balance:', balance);

    // Validate single email
    const validation = await emailVerify.validateEmail('test@example.com');
    console.log('Validation Result:', validation);

    // Batch validation
    const emails = [
      { address: "user1@example.com" },
      { address: "user2@example.com" }
    ];

    const batch = await emailVerify.validateBatch("Test Batch", emails);
    console.log('Batch Task ID:', batch.task_id);

    // Get batch results (you might have to wait longer)
    setTimeout(async () => {
      const results = await emailVerify.getBulkResults(batch.task_id);
      console.log('Batch Results:', results);
    }, 10000);

    // Find email
    const found = await emailVerify.findEmail("John", "example.com");
    console.log('Found Email Result:', found);

  } catch (error) {
    console.error('Error:', error);
  }
}

example();
```

## Browser Usage

The SDK can also be used in browsers 

```html
<script src="<PATH_TO_SCRIPT>/emailVerifySDK.js"></script>
<script>
  const emailVerify = new EmailVerifySDK();
  emailVerify.init('<API_KEY>');
  
  emailVerify.validateEmail('<EMAIL>')
    .then(result => console.log(result))
    .catch(error => console.error(error));
</script>
```

## Development

After checking out the repo run tests

### Test

```bash
npm test
```

You should see an output like this

```bash
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        1.086 s, estimated 2 s
Ran all test suites.
```
