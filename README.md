# 📞 Twilio CRM PoC

Proof of Concept Angular application that integrates with Twilio to display customer details for incoming calls.

## 🚀 Features

- ✅ **Angular Frontend** - Modern web application with beautiful UI
- ✅ **Demo Mode** - Works without backend for testing and demonstration
- ✅ **Customer Data Popup** - Automatic display of customer information
- ✅ **Mock Customer Data** - 5 test customers with Irish phone numbers
- ✅ **Twilio Voice SDK** - Web softphone for receiving calls (production)
- ✅ **SignalR Real-time** - Instant notifications for incoming calls (production)
- ✅ **.NET 8 Web API** - Backend with SignalR and Twilio support (production)

## 🏗️ Architecture

```
┌─────────────────┐    SignalR     ┌─────────────────┐    Webhook    ┌─────────────┐
│   Angular App   │◄──────────────►│  .NET Web API   │◄─────────────►│   Twilio    │
│                 │                │                 │               │             │
│ • Call Popup    │    HTTP API    │ • SignalR Hub   │               │ • Voice SDK │
│ • Customer Info │◄──────────────►│ • Customer API  │               │ • Phone #   │
│ • Twilio Device │                │ • Twilio Token  │               │             │
└─────────────────┘                └─────────────────┘               └─────────────┘
```

## 🛠️ Setup

### Quick Start (Demo Mode)

**For testing the UI and customer popup functionality:**

```bash
git clone https://github.com/YOUR_USERNAME/twilio-crm-poc.git
cd twilio-crm-poc

# Install Angular dependencies
npm install

# Start the application
npm start
# Open http://localhost:4200
```

✅ **No backend required** - The app runs in demo mode with mock data

### Full Setup (Production Mode)

**For complete Twilio integration with real calls:**

#### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK
- Twilio account

#### 1. Install dependencies

```bash
# Angular dependencies
npm install

# .NET dependencies  
cd backend/TwilioCrmApi
dotnet restore
```

#### 2. Enable Production Mode

To enable real Twilio integration, uncomment the following lines:

**In `src/app/core/realtime.service.ts` (line 22):**
```typescript
// this.connectToSignalR(apiBaseUrl); // Remove the comment
```

**In `src/app/core/twilio.service.ts` (line 23):**
```typescript
// await this.initializeTwilioDevice(identity, apiBaseUrl); // Remove the comment
```

**In `src/app/core/customer.service.ts` (line 25):**
```typescript
// return this.makeApiCall(phone, apiBaseUrl); // Remove the comment
```

#### 3. Twilio Configuration

1. Create an account at [Twilio Console](https://console.twilio.com/)
2. Get your credentials:
   - Account SID
   - API Key SID and Secret
   - TwiML App SID (create a new TwiML App)
3. Copy and update configuration file:

```bash
cd backend/TwilioCrmApi
cp appsettings.Development.example.json appsettings.Development.json
```

Then update `appsettings.Development.json` with your actual Twilio credentials:

```json
{
  "Twilio": {
    "AccountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "ApiKeySid": "SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
    "ApiKeySecret": "your_actual_secret_here",
    "TwiMlAppSid": "APxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

#### 4. Run Applications

**Terminal 1 - .NET API:**
```bash
cd backend/TwilioCrmApi
dotnet run
# API will be available at https://localhost:5001
```

**Terminal 2 - Angular:**
```bash
npm start
# Application will be available at http://localhost:4200
```

#### 5. Setup Twilio Webhook (optional)

For real calls, configure webhook:

1. Use ngrok to expose local API:
```bash
ngrok http 5001
```

2. In Twilio Console, configure Voice webhook for your number:
```
https://your-ngrok-url.ngrok.io/api/twilio/voice/webhook
```

## 🧪 Testing

### Demo Mode (No Backend Required)

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Open http://localhost:4200**

3. **Test the popup:**
   - Click "🔔 Simulate Incoming Call"
   - You'll see a popup with customer information for Dublin Tech Solutions Ltd
   - The app uses mock data automatically

4. **Console output:**
   ```
   Backend service unavailable. App will work in demo mode.
   Twilio service unavailable (no backend connection). App will work in demo mode.
   Customer API unavailable. Using mock data directly.
   ```

### Production Mode (With Backend)

1. **Enable production mode** (uncomment lines as described above)
2. **Start .NET API** (`dotnet run`)
3. **Configure Twilio webhook**
4. **Call your Twilio number**
5. **Popup appears automatically** in browser with real customer data

## 📁 Project Structure

```
twilio-crm-poc/
├── src/app/
│   ├── core/                    # Services
│   │   ├── customer.service.ts  # Customer API
│   │   ├── realtime.service.ts  # SignalR client
│   │   └── twilio.service.ts    # Twilio Voice SDK
│   ├── features/
│   │   └── call-popup/          # Popup component
│   ├── environments/            # Configuration
│   └── app.ts                   # Main component
├── backend/TwilioCrmApi/
│   ├── Controllers/
│   │   ├── TwilioController.cs  # Twilio webhook + tokens
│   │   └── CustomersController.cs # Customer API
│   ├── Program.cs               # Application configuration
│   └── appsettings.json         # Settings
└── README.md
```

## 🎯 Test Customers

The system includes 5 test customers from Ireland:

| Phone Number | Name | Email | Notes |
|---------------|------|-------|----------|
| +353851234567 | Dublin Tech Solutions Ltd | contact@dublintech.ie | VIP client, priority support required |
| +353861234567 | Liam O'Connor | liam.oconnor@gmail.com | Regular customer since 2020 |
| +353871234567 | Aoife Murphy | aoife.murphy@example.ie | New client from Cork |
| +35318961000 | Trinity College Dublin | procurement@tcd.ie | Educational institution |
| +353014084800 | Guinness Storehouse | info@guinness-storehouse.com | Tourism sector |

**Demo Mode:** The "Simulate call" button uses +353851234567 (Dublin Tech Solutions Ltd)
**Production Mode:** All phone numbers are available in the backend database

## 🔧 API Endpoints

### Twilio
- `POST /api/twilio/voice/webhook` - Webhook for incoming calls
- `GET /api/twilio/token?identity={user}` - Get Twilio token
- `POST /api/twilio/test/incoming-call` - Test call

### Customers
- `GET /api/customers/by-phone?number={phone}` - Find customer by phone
- `GET /api/customers` - List all customers

### SignalR
- `/hubs/calls` - Hub for real-time call events

## 🚀 Deployment

### Demo Mode Deployment

**For showcasing the UI and customer popup functionality:**

```bash
# Build for production
npm run build

# Deploy dist/ folder to any static hosting:
# - Netlify
# - Vercel
# - GitHub Pages
# - Azure Static Web Apps
```

✅ **No backend required** - Works as a static website

### Production Deployment

**For full Twilio integration:**

1. **Enable production mode** (uncomment service lines)
2. **Update environment configuration:**
   ```typescript
   // src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiBaseUrl: 'https://your-api-domain.com'
   };
   ```
3. **Deploy backend API** to cloud provider
4. **Configure HTTPS certificates**
5. **Use real database** instead of InMemory
6. **Add authentication and authorization**

### Docker (optional)
```bash
# Build Angular
npm run build

# Build .NET
cd backend/TwilioCrmApi
dotnet publish -c Release

## 📄 License

This project is a PoC (Proof of Concept) for demonstrating Twilio integration with Angular and .NET.

## 🆘 Support

### Demo Mode Issues
- **No popup appears:** Check browser console (F12 → Console) for JavaScript errors
- **Customer data missing:** Verify mock data in `customer.service.ts`
- **Styling issues:** Check that Angular build completed successfully

### Production Mode Issues
- **Connection errors:** Ensure .NET API is running on https://localhost:5001
- **No real-time updates:** Check SignalR connection in browser console
- **Twilio errors:** Verify credentials in `appsettings.Development.json`
- **Webhook issues:** Ensure ngrok is running and webhook URL is correct

### Getting Help
1. Check browser logs (F12 → Console)
2. Check .NET API logs in terminal (if using backend)
3. Verify all configuration steps were followed
4. Create an issue in the repository with error details
