# Bangalore Pincode Explorer

A small full-stack application that lets users enter a Bangalore/Bengaluru pincode and see matching area names and post-office details.

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Data source: India Post Pincode API
- Styling: Custom responsive CSS

## Features

- Search by 6-digit pincode
- Bangalore/Bengaluru-only validation
- Area name results
- Post-office details
- Loading and error states
- Responsive UI
- Backend API proxy so the frontend does not call the external postal API directly
- Basic input validation and CORS configuration

## Project structure

```text
bangalore-pincode-explorer/
├── backend/
│   ├── src/server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/App.jsx
│   ├── src/main.jsx
│   ├── src/styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Run locally

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Environment variables

Backend `.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Frontend can optionally use:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is omitted, the frontend uses the local API URL above.

## API

### Health

`GET /api/health`

### Pincode lookup

`GET /api/pincode/:pincode`

Example:

```text
GET /api/pincode/560001
```

The backend validates the pincode, calls the India Post Pincode API, filters the result to Bangalore/Bengaluru, and returns a simplified response.

## Design decisions

1. **Backend proxy:** keeps external API access behind one application API and gives the frontend a stable interface.
2. **Bangalore filter:** the assignment is specifically a Bangalore explorer, so non-Bangalore results are rejected.
3. **Simple architecture:** React + Express keeps the project easy to understand and deploy within the assignment time.
4. **Responsive UI:** the interface works on desktop and mobile without a component library.
5. **Graceful errors:** invalid input, missing pincode data, and upstream API failures return useful messages.

## Deployment

### Backend

Deploy the `backend` directory to Render, Railway, or another Node.js host.

Build/install command:

```bash
npm install
```

Start command:

```bash
npm start
```

Set:

```env
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN
```

### Frontend

Deploy the `frontend` directory to Vercel or Netlify.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Set the frontend environment variable:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

## Notes

The application uses the public India Post Pincode API for postal data. The external API response is normalized by the Express backend before being returned to the React frontend.
