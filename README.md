# Helpful Hugs

Production-oriented React Native mobile application for Helpful-Hearts.

## Why I Built This App

I built Helpful Hugs because accessing healthcare can be difficult when people need the right doctor, an appointment, or a simple explanation of their medical information.

The goal is to bring important healthcare workflows into one mobile experience — from discovering doctors and checking availability to booking appointments, managing prescriptions, and getting easy-to-understand health information.

I also wanted to build something that solves a real-world problem rather than being just another demo project. The app focuses on making healthcare information and care access simpler, more organized, and easier to use for patients.

## What the App Does

- Discover and search for doctors
- View doctor profiles and availability
- Book and manage appointments
- Chat with an AI health assistant
- Upload prescriptions
- Review and edit prescription OCR text
- Get an educational explanation of a reviewed prescription
- Manage healthcare-related workflows from a mobile app

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

Feature-first mobile architecture with a thin routing layer, centralized API client, secure authentication storage, and testable domain modules.

See:
- ARCHITECTURE.md
- DEVELOPMENT_PLAN.md
- CONTRIBUTING.md

## Development

Install dependencies and start the application:

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

For linting, type checking, and tests:

```bash
npm run lint
npm run typecheck
npm test
```

## Production Builds

Production builds use EAS:

```bash
eas build --platform all --profile production
```

The repository includes a manual GitHub Actions CD workflow that validates typecheck, lint, and tests before starting an EAS build.

## Project Status

The mobile application is being developed phase-by-phase with a focus on clean architecture, real backend integration, reliable testing, and production-oriented implementation.

