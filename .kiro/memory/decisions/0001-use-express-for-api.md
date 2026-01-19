# ADR-0001: Use Express for API Framework

**Date**: 2025-01
**Status**: Accepted

## Context

Need an API framework that provides:
- Mature ecosystem with extensive middleware
- Simplicity and flexibility
- Good TypeScript support
- Wide community adoption

## Decision

Use Express 5.x as the HTTP framework for building REST APIs.

## Consequences

**Positive:**
- Mature, battle-tested framework
- Extensive middleware ecosystem
- Simple, unopinionated architecture
- Easy to learn and onboard new developers
- Excellent documentation

**Negative:**
- Less opinionated (requires more decisions)
- Manual async error handling (mitigated in Express 5)
- No built-in validation (use Zod)

## References

- `src/app.ts` - Express app setup
- `standards/domain/errors.md` - Error handling patterns
