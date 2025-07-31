# Tourista: AI-Powered Travel Planner

Tourista is a React Native app that uses AI to generate personalized travel itineraries, manage bookings, and suggest destinations. Features include smart trip planning, budget management, and integration with Google Maps and Firebase.



## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```bash
  npm install -g expo-cli
  ```
- A Firebase project (for backend services)
- Google Cloud Platform project (for Places API and Gemini AI)

### Clone the Repository

```bash
git clone https://github.com/muhammadahmad318/tourista-travel-planner-app.git
cd tourista-travel-planner-app
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Fill in your actual API keys and configuration values in the `.env` file:

   - **Firebase Configuration**: Get these from your Firebase project settings
   - **Google Places API Key**: Create a project in Google Cloud Console and enable Places API
   - **Gemini AI API Key**: Get from Google AI Studio
   - **Other API Keys**: As needed for additional services

3. **Never commit your `.env` file to version control!**

### Start the App

```bash
npx expo start
```

- Use the Expo Go app or an emulator to run the project.

## Features

- AI-generated travel itineraries
- Destination and starting point search
- Budget and date range selection
- Integration with Google Maps and Firebase
- User authentication and trip saving

## Security Best Practices

- All API keys are now stored in environment variables
- The `.env` file is included in `.gitignore`
- Use the `env.example` file as a template for required variables
- Regularly rotate your API keys
- Monitor API usage to prevent abuse

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
