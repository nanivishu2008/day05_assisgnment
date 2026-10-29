# JobTrackr API

A REST API built using Node.js and Express for managing job applications.

## Features

- Create, read, update and delete applications
- Filter applications by status
- Search applications by company or role
- Validate incoming request bodies
- Centralised error handling
- Request logging
- Non-blocking and blocking endpoint demonstrations
- Postman collection for API testing

## Requirements

- Node.js
- npm
- Postman

## Installation

Clone the repository and navigate to the project folder.

Install dependencies:

npm install

Create a `.env` file using `.env.example` as a reference.

Start development mode:

npm run dev

Start normal mode:

npm start

The API runs on http://localhost:5000 by default.

## Environment variables

- PORT: Server port
- NODE_ENV: Application environment
- CLIENT_URL: Allowed CORS origin

Do not commit `.env` to GitHub.

## API routes

| Method | Route | Description |
|---|---|---|
| GET | /api/applications | Get all applications |
| GET | /api/applications?status=Interview | Filter by status |
| GET | /api/applications?search=google | Search applications |
| GET | /api/applications/:id | Get one application |
| POST | /api/applications | Create an application |
| PATCH | /api/applications/:id | Update an application |
| DELETE | /api/applications/:id | Delete an application |
| GET | /api/slow | Demonstrate non-blocking waiting |
| GET | /api/block | Demonstrate event-loop blocking |

## Validation rules

- Company and role are required when creating an application.
- Company and role must contain between 2 and 60 characters.
- Status must be Applied, Interview, Offer or Rejected.
- Priority must be Low, Medium or High.
- appliedOn must be a valid date and cannot be in the future.
- PATCH accepts only recognised fields.

## Error handling

Errors use a consistent response structure:

{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "company": "company is required"
  }
}

Stack traces are included only in development.

## Semantic versioning

The package.json file uses version ranges for dependencies.

The caret (`^`) permits compatible minor and patch updates while keeping the same major version. For example, `^4.21.0` permits versions greater than or equal to 4.21.0 but lower than 5.0.0.

The tilde (`~`) permits patch updates within the same minor version. For example, `~4.21.0` permits versions greater than or equal to 4.21.0 but lower than 4.22.0.

These ranges follow semantic versioning, where versions use the MAJOR.MINOR.PATCH format.

## Node.js event loop demonstration

### /api/slow

This endpoint uses setTimeout to respond after three seconds. While the timer is waiting, Node.js can process other requests.

### /api/block

This endpoint runs a busy loop for approximately three seconds. The loop blocks the JavaScript event-loop thread, delaying other requests until the loop finishes.

This demonstrates that waiting asynchronously does not block the event loop, while synchronous CPU-intensive work does.

## Testing

Import the Postman collection from:

postman/JobTrackr.postman_collection.json

Set the baseUrl variable to:

http://localhost:5000

Run the collection using the Postman Collection Runner.

Basic automated tests can also be run with:

npm test

Start the server before running the automated tests.

## Data storage

Applications are stored in an in-memory array. Data resets when the server restarts.

## Limitations

This project is for learning REST API fundamentals. It does not yet use a database or authentication.