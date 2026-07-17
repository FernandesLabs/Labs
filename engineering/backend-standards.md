# Backend Standards

**Standards for server-side and API development at Fernandes Labs.**

## Context

All Fernandes Labs products that require backend services must follow consistent patterns for security, maintainability, and interoperability.

## Requirements

### Architecture

- **Serverless-first**: Prefer serverless functions over containers
- **Security by default**: All endpoints validate input
- **No secrets in code**: Use environment variables only
- **Error handling**: All errors caught and logged

### Language Standards

When using Node.js:

```javascript
// MUST use strict mode
'use strict';

// MUST validate all inputs
function handler(req, res) {
  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  // Process...
}

// MUST use try/catch for async
try {
  const result = await processRequest();
  return res.json(result);
} catch (error) {
  logger.error(error);
  return res.status(500).json({ error: 'Processing failed' });
}
```

### API Design

- RESTful endpoints where appropriate
- Consistent response format:
  ```json
  {
    "success": true,
    "data": {...},
    "error": null
  }
  ```
- Proper HTTP status codes
- CORS configured correctly
- Rate limiting implemented

### Security

- **Input Validation**: All inputs MUST be validated
- **Authentication**: JWT or session-based
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent abuse
- **Logging**: Structured logs without PII

### Environment

- `.env.example` in repository (no `.env`)
- Secrets in platform env vars only
- Configuration via environment
- No hardcoded values

## Examples

### Good: Input Validation

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  count: z.number().min(1).max(100),
});

export async function POST(req: Request) {
  const result = schema.safeParse(await req.json());
  if (!result.success) {
    return new Response('Invalid input', { status: 400 });
  }
  // Process validated input
}
```

### Bad: No Validation

```javascript
export async function POST(req, res) {
  const { email, count } = await req.json();
  // Direct use of unvalidated input - security risk
  sendEmail(email, count);
}
```

## References

- [Security](./security.md)
- [Testing](./testing.md)