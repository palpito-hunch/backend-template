# ADR-0006: ESLint with Type-Aware Rules

**Date**: 2024-01
**Status**: Accepted

## Context

Need linting that:
- Catches common errors
- Enforces coding standards
- Works with TypeScript types

## Decision

Use ESLint with `@typescript-eslint` plugin and type-aware rules enabled.

## Consequences

**Positive:**
- Catches floating promises
- Enforces explicit return types
- Prevents unsafe `any` usage
- Consistent code style

**Negative:**
- Slower linting (requires type information)
- More configuration complexity

## References

- `eslint.config.mjs`
- `standards/typescript/style.md`
