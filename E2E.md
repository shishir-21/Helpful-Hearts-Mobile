# Mobile E2E smoke tests

Helpful-Hearts Mobile uses Maestro for lightweight device-level smoke testing.

## Prerequisites

1. Install Maestro.
2. Build/install the development or preview app with the package id `com.helpfulhearts.mobile`.
3. Start the backend and provide the same Expo public API configuration required by the app.

## Run

From the repository root:

```bash
maestro test e2e/maestro/smoke.yaml
```

The smoke flow only launches a clean app and waits for the initial UI to settle. It deliberately does not submit credentials or collect healthcare data.

## CI policy

The existing GitHub Actions quality job remains deterministic and does not require an emulator or external backend. Device E2E is a release-gate workflow once a reproducible Android/iOS build environment is available.

Do not put patient data, prescription text, assistant messages, access tokens, or real credentials into E2E fixtures.
