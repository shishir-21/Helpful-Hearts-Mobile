# Production hardening

## Telemetry

Analytics is disabled unless `EXPO_PUBLIC_ANALYTICS_ENABLED=true` is explicitly configured.

Telemetry uses an allowlisted event model and strips healthcare and personal-data fields such as prescription text, assistant content, symptoms, medications, email, phone, and address.

No analytics provider is enabled by default. A provider must be reviewed for healthcare-data handling before being connected.

## Error monitoring

The app error boundary reports only sanitized error metadata through the provider-neutral telemetry boundary. Sensitive screen state and request payloads are not sent.

## Performance

Key app operations can record duration through the provider-neutral performance helper. Performance events contain only metric names and numeric durations.

## Push notifications

Push delivery is intentionally not enabled yet. The current backend does not expose a notification-token registration or delivery contract. Adding local permission/token handling without a server contract would create a non-functional feature, so this remains a Phase 7 follow-up.

## EAS

The repository already contains development, preview, and production EAS profiles in `eas.json`. Production builds require an Expo/EAS project configured by the release owner.

Typical release commands:

```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

Do not commit EAS tokens, signing credentials, API secrets, or patient data.
