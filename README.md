# Helpful-Hearts Mobile

Production-oriented React Native mobile application for Helpful-Hearts.

## Stack

- Expo SDK 57
- React Native 0.86
- React 19.2
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- Axios
- Zod
- React Hook Form
- Expo SecureStore

## Architecture

Feature-first mobile architecture with a thin routing layer, centralized API client, typed configuration, secure authentication storage, and testable domain modules.

See:
- ARCHITECTURE.md
- DEVELOPMENT_PLAN.md
- CONTRIBUTING.md

## Development

Use Node.js LTS. Install dependencies with:

```bash
npm install
npm start
```

For Android:

```npm run android```

For iOS:

```npm run ios```

For linting and type checking:

```bash
npm run lint
npm run typecheck
```

## Environments

Environment-specific public configuration is provided through Expo's `EXPO_PUBLIC_*` variables. Secrets must never be bundled into the mobile application.

## Safety

Helpful-Hearts provides health information and care-access tooling. AI features are informational and must not be used as autonomous diagnosis, prescribing, or medication-change advice.
