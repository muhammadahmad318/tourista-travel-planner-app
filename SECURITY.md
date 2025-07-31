# Security Documentation

## Overview

This document outlines the security measures implemented in the Tourista project to protect sensitive information and API keys.

## Security Measures Implemented

### 1. Environment Variables

All sensitive configuration data has been moved to environment variables:

- Firebase configuration (API keys, project IDs, etc.)
- Google Places API keys
- Gemini AI API keys
- Other third-party service credentials

### 2. Configuration Files Updated

The following files have been secured:

- `firebaseConfig.js` - Firebase configuration
- `firebaseConfig.cjs` - CommonJS Firebase configuration
- `app.json` - Expo app configuration
- `scripts/testSaveFunctionality.js` - Test scripts
- `scripts/populateWithBetterImages.js` - Data population scripts
- `scripts/populateSampleData.js` - Sample data scripts
- `scripts/firebaseConfig.node.js` - Node.js Firebase config

### 3. Git Security

- `.env` files are properly ignored in `.gitignore`
- `env.example` file provided as a template
- No actual API keys are committed to version control

## Required Environment Variables

### Firebase Configuration

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Google APIs

```
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
EXPO_PUBLIC_REACT_NATIVE_GOOGLE_PLACES_AUTOCOMPLETE=your_google_places_api_key
```

### AI Services

```
EXPO_PUBLIC_GEMENI_API_KEY=your_gemini_api_key
```

## Setup Instructions

1. Copy `env.example` to `.env`
2. Fill in your actual API keys and configuration values
3. Never commit the `.env` file to version control
4. Share the `env.example` file with team members

## Security Best Practices

### For Developers

- Always use environment variables for sensitive data
- Regularly rotate API keys
- Monitor API usage and set up alerts
- Use API key restrictions in Google Cloud Console
- Implement rate limiting where possible

### For Deployment

- Set environment variables in your deployment platform
- Use secure secret management services
- Regularly audit access permissions
- Monitor for unusual API usage patterns

## API Key Management

### Google Cloud Platform

- Enable only necessary APIs
- Set up API key restrictions (HTTP referrers, IP addresses)
- Monitor usage in Google Cloud Console
- Set up billing alerts

### Firebase

- Use Firebase Security Rules
- Implement proper authentication
- Monitor usage in Firebase Console
- Set up project-level security

## Incident Response

If you suspect API keys have been compromised:

1. Immediately rotate the affected API keys
2. Review recent API usage for unauthorized access
3. Update environment variables in all deployment environments
4. Audit codebase for any remaining hardcoded keys
5. Update team members with new keys

## Contact

For security-related issues, please create a private issue or contact the project maintainers directly.
