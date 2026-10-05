# Helpful-Hearts Mobile

Helpful-Hearts is a production-oriented React Native healthcare application focused on making doctor discovery, appointments, consultations, prescriptions, and AI-assisted health information easier to access from one mobile experience.

## Product Vision

Helpful-Hearts is being built as an end-to-end healthcare platform for patients and doctors.

The long-term patient journey is:

```text
Discover doctor
    ↓
Check availability
    ↓
Book appointment
    ↓
Receive reminders
    ↓
Join consultation
    ↓
Chat with doctor
    ↓
Receive prescription
    ↓
Review health documents
    ↓
Use AI for educational explanations
    ↓
Manage ongoing healthcare history
```

The doctor journey will eventually include appointment management, availability management, patient context, consultation controls, notes, prescriptions, and follow-up workflows.

> Helpful-Hearts is a healthcare software project. AI features are intended to provide educational assistance and workflow support, not autonomous diagnosis or treatment.

## Current Mobile Features

### Authentication
- [x] Patient registration and login
- [x] Secure authentication token storage
- [x] Authenticated API client
- [x] Current-user session
- [x] Sign out

### Doctor Discovery
- [x] Doctor search/discovery
- [x] Doctor profiles
- [x] Credentials and verification status
- [x] Experience, languages, and hospital information
- [x] Doctor availability

### Appointments
- [x] Slot selection
- [x] Appointment booking
- [x] Appointment list
- [x] Appointment details
- [x] Appointment cancellation
- [x] Appointment rescheduling
- [x] Appointment reminders
- [x] Appointment reminder deep linking

### AI Health Assistant
- [x] AI health assistant
- [x] Conversation history
- [x] New conversations
- [x] Health questions and responses
- [x] Safety notice
- [x] Loading, retry, and error handling

### Prescriptions
- [x] Prescription upload
- [x] JPG/JPEG/PNG/PDF support
- [x] Prescription history
- [x] Prescription details
- [x] OCR review and editing
- [x] Educational AI prescription explanation

### Consultation
- [x] Consultation waiting room
- [x] Two-party WebRTC video/audio
- [x] Authenticated signaling
- [x] Live consultation chat
- [x] Persisted consultation messages
- [x] Consultation history
- [x] Participant authorization
- [x] Consultation session lifecycle

> WebRTC currently requires a native development/preview/production build; Expo Go is not sufficient. Production WebRTC deployments should add TURN for reliable connectivity across restrictive networks.

### Production Readiness
- [x] Push notification token registration
- [x] Push notification token cleanup
- [x] Appointment reminder notifications
- [x] Analytics abstraction with privacy sanitization
- [x] Error/crash monitoring boundary
- [x] E2E smoke-test foundation
- [x] Performance instrumentation foundation
- [x] EAS production build configuration
- [x] Manual production CD workflow
- [x] Release configuration and store-submission checklist
- [ ] Store publication

Store publication remains dependent on external Apple/Google developer accounts, signing credentials, store metadata, and release secrets.

## Technology Stack

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

The mobile application uses a feature-first architecture:

```text
app/
  Route screens and navigation

src/features/
  Domain-specific API, UI, state, and types

src/components/
  Shared UI components

src/lib/
  API client and cross-cutting utilities

src/stores/
  Client-only state

src/config/
  Application configuration

src/types/
  Shared TypeScript types

src/utils/
  Reusable utilities

tests/
  Unit and contract tests
```

State responsibilities:

- **TanStack Query** — server/remote state
- **Zustand** — client-only state
- **SecureStore** — authentication credentials
- **Backend** — authorization and security boundary

Sensitive healthcare data should not be unnecessarily persisted locally.

## Backend and Database Strategy

The mobile app communicates with a separate Helpful-Hearts backend.

The target production data architecture is:

```text
Mobile App
    ↓
Helpful-Hearts Backend
    ↓
PostgreSQL
    ↓
Persistent application data
```

### PostgreSQL

PostgreSQL is the planned primary persistent database for:

- Users
- Doctors
- Doctor credentials
- Appointments
- Consultation sessions
- Consultation messages
- Prescriptions
- Notifications
- Appointment reminders
- Future healthcare records

### Neon PostgreSQL rollout

The current deployment strategy is intentionally incremental:

1. Connect the backend to **Neon PostgreSQL**
2. Run database migrations
3. Verify every existing backend feature against Neon
4. Keep the mobile app and backend running locally during development
5. Test the complete application locally using the live Neon database
6. Deploy the backend only after the database-backed application is stable

At this stage, Neon is a deployment target for the database connection and should not be described as connected until the backend environment is actually configured and verified.

### Redis

Redis is used by the backend for infrastructure workloads rather than as the primary database.

Current backend Redis use cases include:

- API rate limiting
- Doctor availability caching

Permanent healthcare records belong in PostgreSQL, not Redis.

## Development

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

Android:

```bash
npm run android
```

iOS:

```bash
npm run ios
```

Quality checks:

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

The repository also contains GitHub Actions workflows for CI and production Android/CD workflows. Production signing and store credentials remain external to the repository.

## Roadmap

### Phase 8 — Doctor Experience
- [ ] Doctor authentication
- [ ] Doctor dashboard
- [ ] Appointment requests
- [ ] Accept/reject appointments
- [ ] Doctor availability management
- [ ] Patient context
- [ ] Doctor consultation controls
- [ ] Consultation notes
- [ ] Prescription creation
- [ ] Follow-up management

### Phase 9 — Healthcare Records
- [ ] Patient medical profile
- [ ] Medical records
- [ ] Lab reports
- [ ] Health timeline
- [ ] Document management
- [ ] Secure document sharing

### Phase 10 — AI Healthcare
- [ ] Improved symptom-assistance workflow
- [ ] Emergency-symptom safety detection
- [ ] Doctor/specialty recommendations
- [ ] Medical report explanation
- [ ] Prescription intelligence
- [ ] AI consultation summaries

### Phase 11 — Production Consultation
- [ ] TURN server
- [ ] WebRTC reconnection
- [ ] Network-quality handling
- [ ] Improved call controls
- [ ] Native E2E consultation testing

### Phase 12 — Payments
- [ ] Consultation pricing
- [ ] Payment processing
- [ ] Refund workflow
- [ ] Invoices
- [ ] Payment history
- [ ] Doctor earnings

### Phase 13 — Trust, Safety, and Administration
- [ ] Doctor verification workflow
- [ ] Admin dashboard
- [ ] Audit logs
- [ ] Abuse protection
- [ ] Account/data controls
- [ ] Review moderation

### Phase 14 — Production Quality
- [ ] Real analytics provider
- [ ] Real crash monitoring provider
- [ ] Stronger offline/network handling
- [ ] Performance optimization
- [ ] Additional security hardening
- [ ] Full native E2E coverage
- [ ] Database/load testing

### Phase 15 — Store Release
- [ ] Final app branding and store assets
- [ ] Privacy policy
- [ ] Terms and conditions
- [ ] Store metadata
- [ ] Android signing
- [ ] iOS signing
- [ ] Google Play submission
- [ ] App Store submission
- [ ] Production release

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)
- [CONTRIBUTING.md)

## Project Status

Helpful-Hearts is being developed incrementally with an emphasis on:

- Real backend integration
- PostgreSQL-backed persistence
- Secure healthcare data handling
- AI safety boundaries
- Reliable appointment workflows
- Production-oriented mobile architecture
- Automated testing and CI
- Clear separation between implemented features and future roadmap
