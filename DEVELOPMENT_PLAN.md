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

> Phase 6 backend contract: consultation sessions are tied to confirmed appointments. Patients and linked doctor accounts are authorized participants. WebRTC signaling is authenticated and transient; chat messages are persisted as consultation records.
>
> Mobile video/audio uses react-native-webrtc, so Expo Go is not sufficient. A native development/preview/production build is required. WebRTC currently returns a public STUN server; production deployments should add a TURN service for reliable connectivity across restrictive networks.

## Phase 7 — Production hardening
- [x] Push notifications (Expo token registration and backend device delivery contract)
- [x] Analytics privacy abstraction
- [x] Crash/error monitoring boundary
- [x] E2E smoke-test foundation
- [x] Performance instrumentation foundation
- [x] EAS production profile/documentation
- [ ] Store release (pending release credentials, signing, and store accounts)

Every phase must remain runnable and tested before the next feature is merged.

Phase 5 exit note: mobile typecheck, lint, and unit tests must pass before merging. Runtime prescription upload/explanation verification requires the backend APIs and configured AI provider to be available.

Phase 7 note: telemetry is provider-neutral and disabled by default. Healthcare and personal data are excluded from telemetry. Push delivery uses Expo Push Service; production delivery still requires EAS push credentials and store release infrastructure. Store release remains blocked on release credentials, signing, and store accounts.
