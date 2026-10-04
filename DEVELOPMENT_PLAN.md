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
- [ ] Home dashboard
- [ ] Doctor discovery
- [x] Doctor profile
- [x] Doctor availability

## Phase 4 — Appointments
- [ ] Slot selection
- [ ] Booking
- [ ] My appointments
- [ ] Cancellation
- [ ] Rescheduling
- [ ] Appointment reminders

## Phase 5 — AI
- [x] AI health assistant mobile foundation
- [x] Conversation history UI and API contract
- [x] Safety messaging and safe error states
- [ ] Prescription upload
- [ ] OCR review
- [ ] Prescription explanation

> Note: The current backend repository does not yet expose AI or prescription endpoints. This phase implements the authenticated, provider-neutral mobile assistant contract without mock medical responses. Prescription/OCR/explanation remain pending until their backend APIs are implemented.

## Phase 6 — Consultation
- [ ] Waiting room
- [ ] Video/audio
- [ ] Consultation chat
- [ ] Consultation history

## Phase 7 — Production hardening
- [ ] Push notifications
- [ ] Analytics
- [ ] Crash/error monitoring
- [ ] E2E tests
- [ ] Performance tests
- [ ] EAS production builds
- [ ] Store release

Every phase must remain runnable and tested before the next feature is merged.

Phase 5 exit note: mobile typecheck, lint, and unit tests must pass before merging. Runtime AI verification requires the backend assistant endpoints to be available.