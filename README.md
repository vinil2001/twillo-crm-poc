# 📞 Twilio CRM PoC

Proof of Concept Angular application that integrates with Twilio to display customer details for incoming calls.

## 🚀 Features

- ✅ **Angular Frontend** - Modern web application with beautiful UI
- ✅ **Twilio Voice SDK** - Web softphone for receiving calls
- ✅ **SignalR Real-time** - Instant notifications for incoming calls
- ✅ **Customer Data Popup** - Automatic display of customer information
- ✅ **.NET 8 Web API** - Backend with SignalR and Twilio support
- ✅ **Test Data** - Ready-to-use customer data for demonstration

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

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK
- Twilio account

### 1. Clone and install dependencies

```bash
git clone https://github.com/YOUR_USERNAME/twilio-crm-poc.git
cd twilio-crm-poc

# Angular dependencies
npm install

# .NET dependencies  
cd backend/TwilioCrmApi
dotnet restore
```

### 2. Twilio Configuration

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

### 3. Run Applications

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

### 4. Setup Twilio Webhook (optional)

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

### Test popup without Twilio
1. Open http://localhost:4200
2. Click "🔔 Simulate Incoming Call"
3. You'll see a popup with test customer information

### Test with real calls
1. Make sure .NET API is running
2. Configure Twilio webhook
3. Call your Twilio number
4. Popup will appear automatically in browser

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
| +353851234567 | Dublin Tech Solutions Ltd | contact@dublintech.ie | VIP client |
| +353861234567 | Liam O'Connor | liam.oconnor@gmail.com | Regular client |
| +353871234567 | Aoife Murphy | aoife.murphy@example.ie | New client from Cork |
| +35318961000 | Trinity College Dublin | procurement@tcd.ie | Educational institution |
| +353014084800 | Guinness Storehouse | info@guinness-storehouse.com | Tourism sector |

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

### Production Configuration
1. Update `src/environments/environment.ts` with production API URL
2. Configure HTTPS certificates
3. Use real database instead of InMemory
4. Add authentication and authorization

### Docker (optional)
```bash
# Build Angular
npm run build

# Build .NET
cd backend/TwilioCrmApi
dotnet publish -c Release
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📄 License

This project is a PoC (Proof of Concept) for demonstrating Twilio integration with Angular and .NET.

## 🆘 Support

If you encounter issues or have questions:
1. Check browser logs (F12 → Console)
2. Check .NET API logs in terminal
3. Ensure Twilio credentials are correct
4. Create an issue in the repository
