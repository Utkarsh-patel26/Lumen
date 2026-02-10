# Lumen

Lumen is a simple course platform with a Node.js backend and a React frontend.
It supports browsing courses, enrollment, and admin course management.

## What It Includes

- Public course catalog and course detail pages.
- Student enrollment and My Courses views.
- Admin tooling to create and manage courses.
- Auth with JWT-based sessions.
- File uploads for course media.
- Basic dashboards for students and admins.

## Quick Start

```bash
# one-time install for backend
npm install
# start backend (port from env)
npm run dev

# in another terminal
cd frontend
npm install
npm run dev
```

## Start With PowerShell

```powershell
.\start.ps1
```

## Usage

- Open the frontend in the browser (Vite prints the local URL).
- Sign up as a student or admin.
- Students can browse courses and enroll.
- Admins can create, edit, and delete courses.
- Use the dashboard pages to see stats.

## Environment

Create a .env file in the backend root with:

```bash
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

## API Overview

- `POST /auth/signup` register a user with role.
- `POST /auth/login` login and receive JWT.
- `GET /courses` list public courses.
- `GET /courses/:id` view course details.
- `POST /enrollments` enroll in a course.
- `GET /enrollments/me` list current enrollments.
- `GET /dashboard/student` student stats.
- `GET /dashboard/admin` admin stats.
- `POST /admin/courses` create a course.
- `PUT /admin/courses/:id` update a course.
- `DELETE /admin/courses/:id` delete a course.

## Project Structure

- `backend/` Express app, controllers, services, routes, middleware.
- `frontend/` Vite + React app.
- `routes/` legacy API routes.
- `middlewares/` legacy auth helpers.
- `db.js` database connector.
- `index.js` backend entry point.

## Development Notes

- Keep backend and frontend running in separate terminals.
- Use `npm run dev` for hot reload.
- Use `npm run lint` in frontend if needed.
- Logs are printed in the backend terminal.

## Troubleshooting

- If Mongo fails, verify `MONGO_URL`.
- If auth fails, check `JWT_SECRET`.
- If CORS blocks, confirm frontend origin.
- If ports clash, change `PORT`.

## Scripts

- `start.ps1` starts backend and frontend together.
- `npm run dev` starts the backend server.
- `npm run build` builds the frontend.
- `npm run preview` previews the frontend build.

## Contributing

- Keep commits small and focused.
- Prefer descriptive branch names.
- Run formatters or linters before PRs.

## License

- Not specified.

## Acknowledgements

- Built for learning and demo purposes.
- Thanks for using Lumen.
