# API Security Standards

**Priority: P0 (Critical)** - API vulnerabilities expose backend systems to attack.

**Applies to: Backend**

## Security Headers

### Required Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
}));
```

### Header Checklist
- [ ] `Strict-Transport-Security` - Enforce HTTPS
- [ ] `Content-Security-Policy` - Prevent XSS
- [ ] `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- [ ] `X-Frame-Options: DENY` - Prevent clickjacking
- [ ] `Referrer-Policy` - Control referrer information

## Rate Limiting

### Required Implementation

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later'
  }
});

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 attempts per 15 minutes
  message: {
    error: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Too many login attempts, please try again later'
  }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### Rate Limit Guidelines

| Endpoint Type | Window | Max Requests |
|--------------|--------|--------------|
| Public API | 15 min | 100 |
| Auth (login/register) | 15 min | 5 |
| Password reset | 1 hour | 3 |
| Sensitive operations | 1 hour | 10 |

## CORS Configuration

### Required Pattern

```typescript
import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      // Add other allowed origins
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400  // 24 hours
};

app.use(cors(corsOptions));
```

### CORS Checklist
- [ ] Never use `origin: '*'` with credentials
- [ ] Explicitly list allowed origins
- [ ] Limit allowed methods to what's needed
- [ ] Set appropriate `maxAge` for preflight caching

## Authentication

### JWT Implementation

```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: 'HS256'
  });
}

function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    algorithm: 'HS256'
  });
}

function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new AuthenticationError('INVALID_TOKEN', 'Token is invalid or expired');
  }
}
```

### Auth Middleware

```typescript
interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('MISSING_TOKEN', 'Authorization token required');
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  (req as AuthenticatedRequest).user = payload;
  next();
}

function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!roles.includes(user.role)) {
      throw new AuthorizationError('INSUFFICIENT_PERMISSIONS', 'Access denied');
    }

    next();
  };
}
```

### Auth Checklist
- [ ] Use short-lived access tokens (15 min)
- [ ] Implement refresh token rotation
- [ ] Store tokens securely (httpOnly cookies or secure storage)
- [ ] Invalidate tokens on logout
- [ ] Never expose tokens in URLs

## Request Validation

### Required Pattern

```typescript
import { z } from 'zod';

// Define schema
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  name: z.string().min(1).max(100)
});

// Validation middleware
function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ValidationError('INVALID_INPUT', 'Validation failed', {
        errors: result.error.flatten().fieldErrors
      });
    }

    req.body = result.data;
    next();
  };
}

// Usage
app.post('/api/users', validateBody(createUserSchema), createUser);
```

## Error Handling

### Secure Error Responses

```typescript
// WRONG: Exposes internal details
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack  // Never expose stack traces
  });
});

// CORRECT: Safe error response
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log full error internally
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Return safe response
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    });
  }

  // Generic error for unknown errors
  return res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred'
  });
});
```

## API Versioning

### Required Pattern

```typescript
// Version in URL path
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Deprecation headers
app.use('/api/v1', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 01 Jan 2025 00:00:00 GMT');
  next();
});
```

## Checklist Summary

### Before Every API Endpoint
- [ ] Authentication middleware applied
- [ ] Authorization/ownership check implemented
- [ ] Input validated with Zod schema
- [ ] Rate limiting appropriate for endpoint type

### Application-Wide
- [ ] Helmet security headers configured
- [ ] CORS properly restricted
- [ ] Error handling doesn't expose internals
- [ ] Request logging enabled (without sensitive data)
