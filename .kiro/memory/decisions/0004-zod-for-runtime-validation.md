# ADR-0004: Zod for Runtime Validation

**Date**: 2024-01
**Status**: Accepted

## Context

Need runtime validation because:
- TypeScript types are erased at runtime
- API inputs need validation
- Environment variables need validation
- Request bodies need sanitization

## Decision

Use Zod for all runtime validation and type inference.

## Consequences

**Positive:**
- Single source of truth for types and validation
- Excellent TypeScript integration with `z.infer`
- Rich validation API
- Good error messages

**Negative:**
- Another dependency to learn
- Some overlap with TypeScript types

## References

- `src/config.ts` - Environment validation example
- `src/middleware/validate.ts` - Request validation middleware
- `standards/libraries/zod.md`
