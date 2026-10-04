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
- [x] Prescription upload
- [x] OCR review
- [x] Prescription explanation

 > Note: The mobile prescription workflow integrates with the authenticated backend prescription APIs. OCR is intentionally review-first because the backend currently stores uploaded documents with `review_required` status rather than fabricating OCR output.

## Phase 6 — Consultation
- [x] Waiting room foundation
- [ ] Video/audio (pending backend consultation session API)
- [ ] Consultation chat (pending backend consultation chat API)
- [x] Appointment-backed consultation history

## Phase 7 — Production hardening
- [ ] Push notifications
- [ ] Analytics
- [ ] Crash/error monitoring
- [ ] E2E tests
- [ ] Performance tests
- [ ] EAS production builds
- [ ] Store release

Every phase must remain runnable and tested before the next feature is merged.

Phase 5 exit note: mobile typecheck, lint, and unit tests must pass before merging. Runtime prescription upload/explanation verification requires the backend APIs and configured AI provider to be available.

Phase 6 note: the mobile waiting-room and appointment-backed history are implemented without fabricated sessions. Video/audio, live chat, and server-backed consultation records remain pending until the backend exposes consultation contracts.