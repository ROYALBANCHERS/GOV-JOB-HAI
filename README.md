<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Government Job Hai - Frontend & Backend Application

A full-stack job portal application built with React, Vite, Express.js, and SQLite.

## Features

- Job listings and search functionality
- User authentication (login/register)
- Admin dashboard for job management
- Category-based job browsing
- Save jobs and track applications
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   GITHUB_TOKEN=your-github-token-here
   GEMINI_API_KEY=your-gemini-api-key
   PORT=3000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Preview production build locally
- `npm run clean` - Clean build artifacts

## Project Structure

```
GOV-JOB-HAI/
├── src/
│   ├── components/     # React components
│   ├── main.tsx        # Application entry point
│   ├── App.tsx         # Main app component with routing
│   └── index.css       # Global styles
├── server.ts           # Express backend server
├── vite.config.ts      # Vite configuration
├── package.json        # Dependencies and scripts
└── .env                # Environment variables
```

## Default Admin Credentials

- Email: `admin@sarkari.com`
- Password: `admin123`

**Important:** Change these credentials after first login!

## Deployment

For production deployment:

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set `NODE_ENV=production` in your environment

3. Start the server:
   ```bash
   npm start
   ```

## Troubleshooting

**Frontend UI not showing:**
- Ensure dependencies are installed: `npm install`
- Check that the `.env` file exists and is properly configured
- Verify the server is running on the correct port (default: 3000)
- Check browser console for errors

**Database issues:**
- The SQLite database (`jobs.db`) is created automatically on first run
- To reset the database, delete `jobs.db` and restart the server

## License

This project is for educational purposes.

View your app in AI Studio: https://ai.studio/apps/6f77b557-1c12-434e-9ede-b539bb439a04
