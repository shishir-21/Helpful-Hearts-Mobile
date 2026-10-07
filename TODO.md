# Helpful Hearts Mobile — Master TODO

Snapshot: 2026-10-07
Repository: shishir-21/Helpful-Hearts-Mobile (React Native + Expo Android/iOS)

Legend: [x] complete, [~] partial/in progress, [ ] todo, [!] blocked/dependent.

## 1. Foundation
- [x] Expo SDK 57 / React Native / TypeScript
- [x] Expo Router
- [x] Environment validation
- [x] Axios API client
- [x] SecureStore auth
- [x] TanStack Query
- [x] Zustand
- [x] Zod / React Hook Form
- [x] Error boundary
- [x] ESLint / Prettier / TypeScript
- [x] Jest
- [x] CI
- [x] Manual EAS CD
- [x] Production EAS profile
- [x] Android AAB workflow
- [x] Store-submission checklist

## 2. Authentication
- [x] Registration
- [x] Login
- [x] Session bootstrap
- [x] Logout
- [x] Secure token storage
- [x] Patient profile
- [ ] Forgot password
- [ ] Reset password
- [ ] Email verification if backend supports it
- [ ] Account deletion/deactivation UX
- [ ] Final auth edge-case/device tests
- [ ] Verify final access/refresh-token strategy with backend

## 3. Patient Home / Health
- [x] Patient home
- [x] Health timeline
- [x] Timeline event filters
- [x] Timeline date-range filter
- [x] Timeline search
- [x] Medical-record navigation
- [x] Prescription navigation
- [x] Appointment navigation
- [x] Health dashboard overview
- [x] Recent health activity aggregation
- [ ] Final UX polish after backend health-record APIs stabilize
- [ ] Verify dashboard with real backend data

## 4. Doctor Discovery
- [x] Doctor discovery
- [x] Search
- [x] Result cards
- [x] Doctor profile
- [x] Doctor availability
- [x] Loading/empty/error states
- [x] Retry behavior
- [x] Pull-to-refresh
- [x] Focused tests
- [ ] Final Android/iOS accessibility and UX review
- [ ] Verify fields against final backend contract

## 5. Appointments
- [x] Slot selection
- [x] Booking
- [x] Confirmation
- [x] Appointment list/detail
- [x] Cancellation
- [x] Rescheduling
- [x] Status display
- [x] Reminder/deep-link foundation
- [x] Patient tests
- [ ] Verify backend idempotency behavior
- [ ] Verify duplicate-request/concurrency behavior
- [ ] Verify final status-transition contract
- [ ] Android edge-case testing
- [ ] iOS edge-case testing

## 6. Medical Records
- [x] Record list/detail
- [x] Search
- [x] Category filter
- [x] Date filter
- [x] Date sorting
- [x] Clear filters
- [x] Pull-to-refresh
- [x] Lab-report list
- [x] Lab-report search/filter/sort
- [x] Lab-report clear filters
- [x] Lab-report pull-to-refresh
- [ ] Medical-record upload
- [ ] Backend upload contract verification
- [ ] File validation/progress/error handling
- [ ] Delete/retention UX
- [ ] Finalize record categories with backend

## 7. AI Health Assistant
- [x] Assistant API client
- [x] Conversation creation/listing
- [x] Message history
- [x] Send-message client
- [x] Zod contracts
- [x] Safety/error-state foundation
- [ ] Verify assistant screens against current branch
- [!] Backend assistant routes must be available on Helpful-Hearts main
- [ ] End-to-end backend/provider testing
- [ ] Conversation deletion UX when backend supports it
- [ ] Rate-limit/offline UX
- [ ] Android verification
- [ ] iOS verification

## 8. Prescription Analyzer
- [x] Upload client
- [x] Prescription list/detail client
- [x] OCR review client
- [x] Explanation client
- [x] Typed/Zod contracts
- [ ] Backend prescription APIs
- [ ] Private storage contract
- [ ] Real upload/OCR/review/explanation verification
- [ ] Delete/retention UX
- [ ] Large/invalid-file handling
- [ ] Android file-picker testing
- [ ] iOS file-picker testing

## 9. Consultation / Video + Chat
- [x] Consultation API client
- [x] Session create/get/end client
- [x] History/messages client
- [x] WebRTC dependency/configuration
- [x] Camera/microphone permissions
- [x] Consultation UI foundation
- [x] Chat UI foundation
- [ ] Backend consultation session APIs
- [ ] WebRTC signaling backend
- [ ] Chat WebSocket backend
- [ ] Participant authorization
- [ ] Production TURN service
- [ ] Reconnect/network-change handling
- [ ] Call quality/error UX
- [ ] Android real-device testing
- [ ] iOS real-device testing

## 10. Notifications
- [x] Expo Notifications
- [x] Device-token registration client
- [x] Authenticated notification bootstrap
- [x] Session cleanup foundation
- [x] Appointment reminder deep-link foundation
- [ ] Backend notification delivery
- [ ] Production push credentials
- [ ] Booking/cancellation/reschedule notifications
- [ ] Reminder verification
- [ ] Notification preferences
- [ ] Android notification testing
- [ ] iOS notification testing
- [ ] Deep-link edge cases

## 11. Doctor Mobile
- [x] Doctor role-aware routing
- [x] Doctor dashboard
- [x] Appointment list/detail
- [x] Status controls
- [x] Consultation entry
- [x] Loading/error/empty states
- [x] Doctor API contract tests
- [ ] Availability/schedule mobile UI if required
- [ ] Doctor profile editing if supported
- [ ] Doctor notification UX
- [ ] Full doctor E2E workflow

## 12. Production Hardening
- [x] Privacy-sanitized analytics abstraction
- [x] Crash/error monitoring boundary
- [x] Performance instrumentation foundation
- [x] Maestro E2E smoke-test foundation
- [x] EAS production configuration
- [x] Manual CD
- [x] Android AAB workflow
- [x] Release configuration
- [x] Store checklist
- [x] Expo SDK 57 EAS dependency conflict fixed
- [ ] Full production build verification
- [ ] Production EAS secrets
- [ ] Android signing credentials
- [ ] iOS signing credentials
- [ ] Final accessibility audit
- [ ] Final performance audit
- [ ] Production crash-reporting verification

## 13. Testing
- [x] Auth validation/API tests
- [x] Doctor discovery tests
- [x] Appointment tests
- [x] Health timeline tests
- [x] Medical-record filtering/sorting tests
- [x] Lab-report tests
- [x] Dashboard aggregation tests
- [x] Doctor API/role tests
- [x] Consultation contract/state tests
- [x] Push-notification contract tests
- [ ] Assistant backend integration tests
- [ ] Prescription backend integration tests
- [ ] Medical-record upload tests
- [ ] Full Android journey
- [ ] Full iOS journey

## 14. Store Release
- [ ] Google Play release credentials
- [ ] Apple Developer/release credentials
- [ ] Android production signing
- [ ] iOS production signing
- [ ] Final icons/splash/branding
- [ ] Privacy policy / terms / support URLs
- [ ] Store metadata/screenshots
- [ ] Data-safety/privacy declarations
- [ ] Internal Android release
- [ ] TestFlight release
- [ ] Google Play production release
- [ ] App Store production release
- [ ] Post-release monitoring

## Current execution order
1. [ ] Forgot/reset password
2. [ ] Medical-record upload after backend contract
3. [!] Wait for/consume backend AI assistant contract
4. [!] Wait for/consume backend prescription/OCR contract
5. [!] Wait for/consume backend consultation/signaling/chat contract
6. [ ] Verify push notification backend integration
7. [ ] Full Android + iOS device QA
8. [ ] Production EAS build
9. [ ] Store submission

## Cross-repo rule
Helpful-Hearts-Mobile is only the Android/iOS client. Helpful-Hearts owns the shared FastAPI API. Never invent a Mobile-only backend endpoint; both Mobile and Web must use the same versioned backend contract.