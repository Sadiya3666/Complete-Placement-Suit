# Complete Placement Suite 🎓

A unified platform integrating three powerful tools for job placement success:
- **Job Notification Tracker** - Discover and track job opportunities
- **Placement Readiness Platform** - Prepare for interviews with role-specific checklists
- **AI Resume Builder** - Create ATS-friendly resumes with AI assistance

## 🚀 Quick Start

### Running All Three Applications Together

```powershell
# From the root directory
npm run dev
```

This will start all three applications on different ports:
- **Job Tracker**: http://localhost:5001
- **Placement Readiness**: http://localhost:5002
- **Resume Builder**: http://localhost:5003

### Running Individual Applications

```powershell
# Job Tracker only
npm run dev:job

# Placement Readiness only
npm run dev:prep

# Resume Builder only
npm run dev:resume
```

## 📁 Project Structure

```
Complete-Placement-Suite/
├── apps/
│   ├── job-tracker/              # Job discovery and tracking
│   ├── placement-readiness/      # Interview preparation
│   └── resume-builder/           # Resume creation tool
├── package.json                  # Root orchestration
└── INTEGRATION_PLAN.md          # Integration roadmap
```

## 🔧 Installation

If you haven't installed dependencies yet:

```powershell
# Install root dependencies (concurrently)
npm install

# Install all app dependencies
npm run install:all
```

## 🎯 Current Status

### ✅ Phase 1: Repository Merge - COMPLETE
- All three projects merged with commit history preserved
- Clean folder structure established
- Individual apps functional

### 🚧 Phase 2: Integration - IN PROGRESS
The apps currently run independently. To make them work together:

1. **Shared Authentication** - Single sign-on across all apps
2. **Event Bus (RabbitMQ)** - Cross-module communication
3. **Unified Database** - Shared PostgreSQL instance
4. **Unified Dashboard** - Single entry point for all features

See `INTEGRATION_PLAN.md` for detailed integration steps.

## 🌟 Features

### Job Notification Tracker
- Aggregate jobs from multiple sources
- Remove duplicates automatically
- Personalized job notifications
- Application status tracking

### Placement Readiness Platform
- Role-specific interview checklists
- Progress tracking
- Readiness score calculation
- Skill gap analysis

### AI Resume Builder
- ATS-friendly templates
- AI-powered suggestions
- Multiple resume versions
- Export to PDF

## 📝 Next Steps

1. **Run the apps** using `npm run dev`
2. **Test each feature** independently
3. **Review** `INTEGRATION_PLAN.md` for cross-module integration
4. **Implement** shared authentication (Phase 2)

## 🤝 Contributing

This is a monorepo containing three integrated applications. When making changes:
- Keep apps in their respective `apps/` folders
- Test individual apps before integration
- Follow the integration plan for cross-module features

## 📄 License

See individual app directories for license information.
