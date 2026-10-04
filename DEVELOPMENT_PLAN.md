# Development Plan

## Phase 0 — Product and architecture
- [x] Mobile repository created
- [x] Architecture documented
- [x] Feature-first structure defined
- [x] Security boundaries documented

## Phase 1 — Mobile foundation
- [x] Expo + TypeScript foundation
- [x] Expo Router
- [x] Environment validation
- [x] API client
- [x] Secure token storage abstraction
- [x] TanStack Query provider
- [x] Zustand store
- [x] Error boundary
- [x] ESLint / Prettier / TypeScript
- [x] Unit-test foundation
- [x] CI workflow
- [x] CD workflow (manual EAS build)

## Phase 2 — Authentication
- [x] Login
- [x] Registration
- [x] Session bootstrap
- [x] Logout
- [ ] Forgot/reset password
- [ ] Patient profile

## Phase 3 — Patient experience
- [x] Home dashboard
- [x] Doctor discovery
- [x] Doctor profile
- [x] Doctor availability

## Phase 4 — Appointments
- [x] Slot selection
- [x] Booking
- [x] My appointments
- [ ] Cancellation
- [ ] Rescheduling
- [ ] Appointment reminders

## Phase 5 — AI
- [x] AI health assistant mobile foundation
- [x] Conversation history UI and API contract
- [x] Safety messaging and safe error states
- [x] Prescription upload
- [x] OCR review
- [x] Prescription explanation

## Phase 6 — Consultation
- [x] Waiting room foundation
- [x] Server-backed consultation session API integration
- [x] Two-party WebRTC video/audio signaling and native media UI
- [x] Live consultation chat with persisted WebSocket messages
- [x] Full server-backed consultation history
- [x] Session lifecycle and participant authorization

## Phase 7 — Production hardening
- [x] Push notifications (token registration, authenticated device persistence, delivery contract, and session cleanup)
- [x] Analytics privacy abstraction
- [x] Crash/error monitoring boundary
- [x] E2E smoke-test foundation
- [x] Performance instrumentation foundation
- [x] EAS production build profile and manual CD workflow
- [x] Release configuration and store-submission checklist
- [ ] Store publication (blocked on external Apple/Google developer accounts, signing credentials, and release secrets)

> Phase 7 release boundary: all repository-controlled production-hardening work is complete. Store publication cannot be truthfully automated or marked complete without the external credentials and store accounts above.

Every phase must remain runnable and tested before the next feature is merged.

Phase 7 note: telemetry is provider-neutral and disabled by default. Healthcare and personal data are excluded from telemetry. Push delivery uses Expo Push Service; production push requires the EAS project and platform credentials. WebRTC production reliability should use a TURN service in addition to STUN.
