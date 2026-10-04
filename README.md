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
- Expo Notifications
- react-native-webrtc

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

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

For linting and type checking:

```bash
npm run lint
npm run typecheck
npm test
```

## Production builds

Production builds use EAS:

```bash
eas build --platform all --profile production
```

The repository includes a manual GitHub Actions CD workflow that validates typecheck/lint/tests before starting an EAS build. It requires the `EXPO_TOKEN` repository secret.

For store submission, configure the EAS account, Android application credentials/signing, Apple Developer credentials, App Store Connect application ID, and required GitHub/EAS secrets. These credentials are intentionally not stored in the repository.

The current project is release-ready from a code/configuration perspective, but it cannot be published to Google Play or the App Store until those external credentials and store accounts are supplied.

## Environments

Environment-specific public configuration is provided through Expo's `EXPO_PUBLIC_*` variables. Secrets must never be bundled into the mobile application.

## Safety

Helpful-Hearts provides health information and care-access tooling. AI features are informational and must not be used as autonomous diagnosis, prescribing, or medication-change advice.
