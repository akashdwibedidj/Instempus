# Instempus

Instempus is a role-aware college campus operations platform built to streamline communication, approvals, and issue resolution across academic and hostel workflows.

It brings together notice management, gate-pass and hostel operations, grievance tracking, messaging, and AI-assisted support into a single campus experience.

## Overview

Instempus is designed for BPUT-affiliated colleges and helps different campus stakeholders work from a shared system:

- Students can access notices, gate pass workflows, and hostel services
- Faculty mentors can review academic and duty-related cases
- Wardens and administrators can manage hostel rules, curfew checks, and escalations
- Support teams can track maintenance and campus issues from a single board

## Core features

- Smart gate-pass and QR verification flows
- Verified notices feed for campus updates
- Hostel and campus issue board
- Direct messaging between users and teams
- Role-based dashboards for different stakeholders
- AI-powered campus assistant for common rules and operational queries
- Responsive Android-style UI for mobile-first usage

## Tech stack

- React + TypeScript + Vite
- Express server for API routes
- Google Gemini API for AI chat assistance
- Supabase integration support
- Capacitor for mobile wrapper support
- Tailwind CSS for styling

## Project structure

```text
.
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── ai/
│   │   ├── android/
│   │   ├── auth/
│   │   ├── canteen/
│   │   ├── emergency/
│   │   ├── home/
│   │   ├── issues/
│   │   ├── messaging/
│   │   ├── profile/
│   │   ├── security/
│   │   ├── services/
│   │   └── story/
│   ├── i18n/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.ts
├── vite.config.ts
├── capacitor.config.ts
├── package.json
├── .env.example
├── index.html
├── metadata.json
├── README.md
└── tsconfig.json
```

## Environment setup

Create a local environment file from the provided example:

```bash
cp .env.example .env.local
```

Then configure the required variables:

```env
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="your_app_url"
```

The server expects `GEMINI_API_KEY` for the `/api/chat` AI endpoint.

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

This runs the Express server and Vite dev middleware together.

## Production build

```bash
npm run build
npm run start
```

## Available scripts

```bash
npm run dev      # start app in development mode
npm run build    # build frontend assets
npm run start    # start Express server
npm run preview  # preview production build
npm run lint     # TypeScript validation
```

## API

The app exposes a Gemini-backed chat endpoint:

```http
POST /api/chat
```

Request body:

```json
{
  "messages": [
    { "role": "user", "content": "What are the hostel curfew rules?" }
  ],
  "systemInstruction": "Optional custom system instruction"
}
```

Example response:

```json
{
  "reply": "The hostel curfew is 20:30 hours..."
}
```

## Notes

This project is intended as a campus operations assistant and mobile-first portal for college stakeholders. It combines operational workflows with AI support to reduce repetitive administrative work and improve communication across campus teams.

## License

This project is configured with TypeScript and uses standard project-level setup files. Check the repository for usage and deployment details relevant to your environment.
