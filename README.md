# YVH Droid Target Selection Module

A high-performance, resilient microservice for advanced target selection in YVH combat droids, using sophisticated protocols and real-time radar data processing.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

This service implements an intelligent target prioritization algorithm for YVH (Yuuzhan Vong Hunter) droids, providing real-time tactical decision support based on configurable protocols and environmental scan data. The system features comprehensive audit logging, high throughput processing, and a RESTful API interface.

## System Requirements

- **Node.js**: v20.0.0 or higher (Latest LTS recommended)
- **MongoDB**: v7.0 or higher
- **npm** or **yarn**

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/shafraza/droid-target-selection.git
cd droid-target-selection

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root:

```
RADAR_API_PROTOCOL=http
RADAR_API_HOST=localhost
RADAR_API_PORT=3000
MONGODB_URI=mongodb://localhost:27017/droid-target-selection
```

> **Note**: For production environments, consider using a managed MongoDB service and appropriate security configurations.

### Build & Run

```bash
# Build the application
npm run build

# Start the service
npm start
```

The API service will be available at `http://localhost:3000`.

## API Documentation

### Target Selection

**POST /radar**

Processes radar scan data and returns optimal target coordinates based on specified protocols.

**Request Body:**

```json
{
  "protocols": ["avoid-mech", "prioritize-soldiers"],
  "scan": [
    {
      "coordinates": {"x": 0, "y": 40},
      "enemies": {"type": "soldier", "number": 10}
    },
    {
      "coordinates": {"x": 12, "y": 0},
      "enemies": {"type": "mech", "number": 1}
    }
  ]
}
```

**Response:**

```json
{"x": 0, "y": 40}
```

### Audit System

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/audit` | GET | Retrieve paginated list of all target selection calculations |
| `/audit/:id` | GET | Get detailed information about a specific calculation |
| `/audit/:id` | DELETE | Remove a calculation record from the audit log |

## Utility Scripts

The project includes convenient shell scripts for audit management:

```bash
# Make scripts executable
chmod +x ./scripts/audit-*.sh

# List all audit records
./scripts/audit-list.sh

# Get details for a specific record
./scripts/audit-detail.sh <audit_id>

# Delete a specific record
./scripts/audit-delete.sh <audit_id>
```

## Testing

Run the comprehensive test suite with:

```bash
./tests.sh
```

The test harness verifies protocol implementation, error handling, and edge cases to ensure robust operation in all conditions.

## Containerization

### Docker Deployment

```bash
# Build the Docker image
docker build -t yvh-target-selection:latest .

# Run the container
docker run -d -p 3000:3000 --name yvh-target-service yvh-target-selection:latest
```

### Docker Compose

For local development with MongoDB:

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/droid-target-selection
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up -d
```

## Architecture

The service follows a layered architecture pattern:

- **Controller Layer**: API endpoints and request validation
- **Service Layer**: Business logic and protocol implementation
- **Data Layer**: MongoDB persistence and audit logging
- **Utility Layer**: Helper functions and common utilities

### Protocol Implementation

The system supports various targeting protocols including:

- `avoid-mech`: Avoid targeting mechanized units when possible
- `prioritize-soldiers`: Target infantry units first
- `closest-enemies`: Select targets with the shortest approach vector
- `furthest-enemies`: Engage targets at maximum distance
- `assist-allies`: Prioritize targets threatening friendly units

Multiple protocols can be combined to create sophisticated targeting behavior.


## License

This project is licensed under the MIT License - see the [LICENSE](#) file for details.
