# Integrated Donation System Server & Dashboard

This integrated server combines the Express.js API backend with a React-based dashboard frontend, all served from a single Node.js application.

## Features

### 🎯 **Integrated Solution**

- **Single Server**: Both API and dashboard served from one Express app
- **Real-time Dashboard**: Live React dashboard with auto-refresh
- **Ngrok Integration**: Automatic public URL generation for external access
- **RESTful API**: Complete CRUD operations for donation requests

### 📊 **Dashboard Features**

- Real-time statistics and metrics
- Request filtering and status management
- Interactive request management (approve, reject, fulfill)
- Responsive design for all screen sizes
- Auto-refresh every 30 seconds

### 🔗 **API Endpoints**

- `GET /api/health` - Server health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/requests` - Get all requests (with filtering)
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id/status` - Update request status
- `DELETE /api/requests/:id` - Delete request
- `POST /webhook/request` - Webhook for external integrations

## Quick Start

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Run Integrated Server**

```bash
# Production mode
npm run integrated

# Development mode with auto-reload
npm run dev-integrated
```

### 3. **Access the System**

- **Dashboard**: http://localhost:3001/dashboard
- **API**: http://localhost:3001/api/
- **Health Check**: http://localhost:3001/api/health

## Configuration

The server automatically tries to create an ngrok tunnel for public access. If successful, you'll see:

```
🌐 Ngrok tunnel created: https://abc123.ngrok.io
📊 Public Dashboard: https://abc123.ngrok.io/dashboard
🔗 Public API: https://abc123.ngrok.io/api/
📝 Webhook endpoint: https://abc123.ngrok.io/webhook/request
```

## API Usage Examples

### Create a New Request

```bash
curl -X POST http://localhost:3001/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "requesterName": "Local Charity",
    "itemRequested": "Winter Coats",
    "quantity": 20,
    "location": "Boston, MA",
    "category": "Clothing",
    "priority": "high",
    "contactEmail": "contact@charity.org",
    "notes": "Needed for homeless outreach program"
  }'
```

### Update Request Status

```bash
curl -X PUT http://localhost:3001/api/requests/req-123/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

### Get Filtered Requests

```bash
# Get only pending requests
curl "http://localhost:3001/api/requests?status=pending"

# Get high priority requests
curl "http://localhost:3001/api/requests?priority=high"

# Get requests by category
curl "http://localhost:3001/api/requests?category=Food"
```

## Webhook Integration

External systems can send requests via webhook:

```bash
curl -X POST http://localhost:3001/webhook/request \
  -H "Content-Type: application/json" \
  -d '{
    "requester_name": "Food Bank Network",
    "item_requested": "Canned Goods",
    "quantity": 100,
    "location": "Chicago, IL",
    "category": "Food",
    "priority": "urgent",
    "contact_email": "requests@foodbank.org",
    "notes": "Emergency distribution needed"
  }'
```

## Dashboard Management

The integrated dashboard provides:

1. **Real-time Statistics**

   - Total requests
   - Pending requests
   - Fulfilled requests
   - Server uptime

2. **Request Management**

   - View all requests in a sortable table
   - Filter by status (all, pending, approved, fulfilled, rejected)
   - Quick action buttons to approve, reject, or fulfill requests
   - Auto-refresh every 30 seconds

3. **Visual Status Indicators**
   - Color-coded status badges
   - Priority indicators
   - Request category labels

## Deployment Notes

### Local Development

- Server runs on port 3001 by default
- Dashboard accessible at `/` and `/dashboard`
- API endpoints under `/api/`

### Production Deployment

- Set `PORT` environment variable for custom port
- Ngrok provides public HTTPS access
- All data stored in memory (add database for production)

### Integration with Frontend

If you have a separate React frontend (like the main app), you can:

1. Use the API endpoints for data
2. Embed the dashboard as an iframe
3. Use the webhook endpoints for real-time updates

## File Structure

```
server/
├── integrated-server.js    # Main integrated server file
├── server.js              # Original API-only server
├── dash.jsx               # Original React dashboard component
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Available Scripts

- `npm start` - Run original API server
- `npm run integrated` - Run integrated server with dashboard
- `npm run dev` - Run original server in development mode
- `npm run dev-integrated` - Run integrated server in development mode
- `npm test` - Test server health endpoint

## Next Steps

1. **Add Database**: Replace in-memory storage with PostgreSQL, MongoDB, or similar
2. **Authentication**: Add user authentication and role-based access
3. **Real-time Updates**: Implement WebSocket connections for live updates
4. **Advanced Analytics**: Add charts and reporting features
5. **Email Notifications**: Send notifications for status changes
6. **File Uploads**: Support for attachments and images

---

🎉 **Your integrated donation system is now ready!** Visit the dashboard to start managing requests.
