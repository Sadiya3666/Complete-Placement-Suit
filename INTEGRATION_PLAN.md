# Complete Placement Suite - Integration Master Plan

## 1. Project Goal
Merge three existing tools into a unified platform where:
**Job Discovery** -> triggers -> **Interview Prep** -> triggers -> **Resume Customization**.

## 2. Directory Structure
```
Complete-Placement-Suite/
├── apps/
│   ├── job-tracker/           # https://github.com/Sadiya3666/Job-Notification-Tracker
│   ├── placement-readiness/   # https://github.com/Sadiya3666/Placement-Readiness-Platform
│   └── resume-builder/        # https://github.com/Sadiya3666/AI-Resume-Builder
├── packages/                  # Shared libraries (future)
├── docker-compose.yml         # Shared infrastructure (Postgres, RabbitMQ)
└── package.json               # Monorepo root
```

## 3. Architecture & Data Flow

### The "Event-Driven" Workflow
1. **User saves a Job** (Job Tracker)
   - Event Published: `JOB_SELECTED`
   - Payload: `{ role: "React Dev", skills: ["React", "Redux"] }`

2. **Placement Readiness** (Listener)
   - Receives `JOB_SELECTED`
   - Action: Generates a checklist specifically for "React" and "Redux".

3. **Resume Builder** (Listener)
   - Receives `JOB_SELECTED`
   - Action: Creates a resume draft highlighting "React" experience.

### Unified Database Schema (PostgreSQL)
All apps share one database but own their own tables.
- `users`: Shared identity.
- `jobs`: Owned by Job Tracker.
- `prep_plans`: Owned by Readiness Platform (Foreign Key to `jobs`).
- `resumes`: Owned by Resume Builder (Foreign Key to `jobs`).

## 4. Implementation Steps

### Phase 1: Infrastructure (RabbitMQ & Postgres)
You need a `docker-compose.yml` file to run the shared services.

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: placement_suite
    ports:
      - "5432:5432"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```

### Phase 2: Shared Authentication
1. Pick **Job Tracker** as the primary Auth provider.
2. In the other two apps, remove the "Login" screens.
3. Instead, verify the **JWT Token** passed from the main dashboard.

### Phase 3: The Dashboard (Frontend)
Create a new React App (`apps/web-portal`) to serve as the wrapper.
It should have a persistent **Sidebar**:
- 🏠 Dashboard
- 💼 Jobs
- 📚 Prep
- 📄 Resumes

## 5. Next Steps for You
1. **Push the code**: Run `git push -u origin main`.
2. **Install dependencies**: Go into each `apps/` folder and run `npm install`.
3. **Database**: Use the Unified Schema commands to set up your PostgreSQL table.
