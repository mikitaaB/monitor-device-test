# Device Monitor

Temperature and humidity monitoring system built with Node.js  and PostgreSQL. It connects to two sensors via Modbus TCP/IP and provides both real‑time monitoring and historical statistics through a web interface.

## How to run locally

### Environment Setup

1. Create a `.env` file in the root directory by copying `.env.example`:
   ```
   cp .env.example .env
   ```

2. Adjust the values in `.env` as needed for your local environment.

### Database Setup

1. Make sure PostgreSQL is installed and running on your machine.

2. Create the database:
   ```
   psql -U postgres
   CREATE DATABASE monitor_db;
   \q
   ```

3. Navigate to the server directory and set up the database schema:
   ```
   cd server
   npm run db:generate
   npm run db:push
   ```

### Server Setup

1. Install server dependencies:
   ```
   cd server
   npm install
   ```

2. Start the server in development mode:
   ```
   npm run dev
   ```

### Client Setup

1. Install client dependencies:
   ```
   cd client
   npm install
   ```

2. Start the client in development mode:
   ```
   npm run dev
   ```

## How to run with Docker

### Environment Setup for Docker

1. Create a `.env` file in the root directory by copying `.env.example`:
   ```
   cp .env.example .env
   ```

2. Adjust the values in `.env` for Docker


### Starting the Application

1. Build and start all services with Docker Compose:
   ```
   docker-compose up -d
   ```

2. To stop the application:
   ```
   docker-compose down
   ```

3. To rebuild the containers (after making changes):
   ```
   docker-compose up -d --build
   ```
