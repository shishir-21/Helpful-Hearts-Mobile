# Helpful-Hearts Mobile Architecture

## Goals

- Reliable at the initial 100 daily-user scale.
- Easy to evolve toward higher traffic without rewriting the client.
- Strong separation between navigation, UI, domain features, server state, and infrastructure.
- Secure handling of authentication tokens and health-related uploads.
- Testable business flows.

## Application layers

```
Expo Router
  -> route guards/screens
  -> feature modules
  -> domain hooks + validation
  -> API services / query layer
  -> FastAPI backend
```

## Folder responsibilities

- `app/`: routes only; no business logic.
- `src/features/`: feature-owned UI, hooks, API functions and types.
- `src/components/`: reusable UI primitives.
- `src/lib/`: cross-cutting infrastructure.
- `src/stores/`: client-only state.
- `src/config/`: validated public configuration.
- `src/types/`: shared application types.
- `src/utils/`: pure utilities.

## State

TanStack Query owns remote state. Zustand owns client-only state. SecureStore owns authentication credentials. Server state should not be duplicated in Zustand.

## Authentication

Use short-lived access tokens and refresh tokens from the backend. Store tokens with SecureStore. Route protection is a UX concern; backend authorization is the security boundary.

## Healthcare data

Prescription images should be uploaded through backend-authorized object-storage flows. The app should retain identifiers/metadata instead of unnecessary local copies.

## Reliability

Network requests use timeouts. Read operations may retry; appointment creation must not blindly retry. Critical writes should support idempotency keys when the backend exposes them. Every network-backed screen needs loading, empty, error and offline states.