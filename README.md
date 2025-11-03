# ClaudeAPI

API Console - A React + Express application for testing API endpoints.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

```bash
npm install
```

## Starting the Project

### Development Mode

To start both the frontend client and backend server concurrently:

```bash
npm run dev
```

This will start:
- **Frontend (Vite)**: http://localhost:5173
- **Backend (Express)**: http://localhost:3001

### Alternative: Run Client and Server Separately

If you need to run them separately:

```bash
# Terminal 1 - Frontend only
npm run dev:client

# Terminal 2 - Backend only
npm run dev:server
```

## Production Build

```bash
npm run build
```

This compiles TypeScript and builds the Vite project to the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

Previews the production build locally.