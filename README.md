# Academic Journey Dashboard

A comprehensive school management system for administrators, teachers, and parents. 

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn-ui
- **Backend**: Express.js, Node.js
- **Database**: MySQL
- **Authentication**: JWT-based authentication

## Features

- **Role-based Access Control**: Different views and permissions for administrators, teachers, and parents
- **Student Management**: Track student information and academic progress
- **Grade Management**: Record and view student grades
- **Feedback System**: Allow teachers to provide feedback on student performance
- **Reporting**: Generate academic reports and visualize performance data

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)

### Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE academic_journey;
```

2. Import the schema:

```bash
mysql -u your_username -p academic_journey < mysql_schema.sql
```

### Backend Setup

1. Navigate to the server directory:

```bash
cd src/server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```
# API Configuration
VITE_API_URL=http://localhost:5000/api

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=academic_journey

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=5000
```

4. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Install dependencies from the project root:

```bash
npm install
```

2. Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

3. Start the frontend development server:

```bash
npm run dev
```

## User Roles

### Administrator

- Manage users (teachers, parents)
- Manage students
- Manage subjects
- View all grades and feedback
- Generate reports

### Teacher

- View assigned students
- Record grades
- Provide feedback
- View academic performance

### Parent

- View their children's information
- View their children's grades and academic performance
- View feedback from teachers

## Development

### Project Structure

- `/src` - Frontend React application
- `/src/server` - Backend Express application
- `/src/components` - Reusable UI components
- `/src/pages` - Page components for different routes
- `/src/lib` - Utility functions and services
- `/src/types` - TypeScript type definitions

### Running Both Frontend and Backend

To run both the frontend and backend concurrently:

```bash
# Start the backend
npm run server

# In a separate terminal, start the frontend
npm run dev
```

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ec15c980-247b-4502-9a1c-0a3ef46929a1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ec15c980-247b-4502-9a1c-0a3ef46929a1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ec15c980-247b-4502-9a1c-0a3ef46929a1) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
