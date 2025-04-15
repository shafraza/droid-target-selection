# YVH Droid Target Selection Module

This module handles target selection for YVH combat droids based on various protocols and radar scan data.

## Requirements

- Node.js (v14+)
- MongoDB
- npm or yarn
- **MongoDB must be installed and running locally** at `mongodb://localhost:27017`  
  (You can change the URI in the `.env` file)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/shafraza/droid-target-selection.git
   cd droid-target-selection
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
      RADAR_API_PROTOCOL=http
      RADAR_API_HOST=localhost
      RADAR_API_PORT=3000
      MONGODB_URI=mongodb://localhost:27017/droid-target-selection
     ```

4. Build the project:
   ```
   npm run build
   ```

## Running the Application

1. Start the application:
   ```
   npm start
   ```

2. The API will be available at http://localhost:3000

## API Endpoints

### POST /radar
Submit radar scan data for target selection.

Example request:
```json
{
  "protocols": ["avoid-mech"],
  "scan": [
    {
      "coordinates": {"x": 0, "y": 40},
      "enemies": {"type": "soldier", "number": 10}
    }
  ]
}
```

Example response:
```json
{"x": 0, "y": 40}
```

### GET /audit
Retrieve a list of recent calculations.

### GET /audit/:id
Retrieve details of a specific calculation.

### DELETE /audit/:id
Delete a specific calculation from the audit log.

## Utility Scripts

The project includes three utility scripts for interacting with the audit system:

1. List all audit records:
   ```
   ./scripts/audit-list.sh
   ```

2. Get details of a specific audit record:
   ```
   ./scripts/audit-detail.sh <audit_id>
   ```

3. Delete a specific audit record:
   ```
   ./scripts/audit-delete.sh <audit_id>
   ```

Make sure to make these scripts executable first with:

```
chmod +x ./scripts/audit-*.sh
```

## Testing

Run the provided test scripts:
```
./tests.sh
```
