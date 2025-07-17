# Jira Manager

A modern, fast, and type-safe dashboard for viewing Jira tasks. Built with React, TypeScript, and Vite.

## Features

- Light/Dark theme switch
- Sortable Jira task table
- Fast UI, easy setup

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repository-url>
cd jira-manager
npm install
```

### 2. Setup Backend

```bash
cd backend
npm install
```
Create a `.env` file from `env.example` in `backend/`:
```
JIRA_DOMAIN=https://your-domain.atlassian.net
JIRA_EMAIL=your@email.com
JIRA_API_TOKEN=your_api_token
JIRA_FILTER_ID=your_filter_id
```

### 3. Run Backend

```bash
node server.js
```
Backend runs at `http://localhost:3001`.

### 4. Run Frontend

```bash
cd ..
npm run dev
```
Frontend runs at `http://localhost:5173`.
