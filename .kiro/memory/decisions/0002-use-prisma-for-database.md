# ADR-0002: Use Prisma for Database Access

**Date**: 2024-01
**Status**: Accepted

## Context

Need an ORM/database client that provides:
- Type safety
- Migration management
- Good developer experience
- Support for common databases

## Decision

Use Prisma as the database ORM.

## Consequences

**Positive:**
- Full type safety with generated types
- Schema-first approach with migrations
- Excellent TypeScript integration
- Prisma Studio for data exploration

**Negative:**
- Slight performance overhead vs raw SQL
- Some complex queries harder to express
- Generated client increases bundle size

## References

- `prisma/schema.prisma`
- `standards/libraries/prisma.md`
