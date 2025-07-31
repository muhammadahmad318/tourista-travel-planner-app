# Firestore Setup Documentation

## Overview

This document outlines the Firebase Firestore configuration for the Tourista app, including collection schemas, utility functions, and usage examples.

## Collections Structure

### 1. `destinations` Collection
Stores all destination/tour data.

**Schema:**
```javascript
{
  id: "auto-generated",
  name: "string",
  image: "string (URL)",
  description: "string",
  rating: "number",
  price: "string",
  duration: "string",
  location: "string",
  category: "string",
  startingPoint: "string",
  latitude: "number",
  longitude: "number",
  departureDate: "string (ISO date)",
  endingDate: "string (ISO date)",
  itinerary: [
    {
      time: "string",
      place: "string",
      description: "string",
      photo: "string (URL)",
      price: "string",
      type: "string"
    }
  ],
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 2. `users` Collection
Stores user profile data (document ID = Firebase Auth UID).

**Schema:**
```javascript
{
  id: "firebase-auth-uid",
  email: "string",
  displayName: "string",
  photoURL: "string (URL)",
  phoneNumber: "string",
  dateOfBirth: "string (ISO date)",
  preferences: {
    favoriteCategories: ["string"],
    budgetRange: "string",
    travelStyle: "string",
    preferredDestinations: ["string"]
  },
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 3. `trips` Collection
Stores user-created trips and itineraries.

**Schema:**
```javascript
{
  id: "auto-generated",
  userId: "string (Firebase Auth UID)",
  title: "string",
  destination: "string",
  startDate: "string (ISO date)",
  endDate: "string (ISO date)",
  budget: "number",
  travelers: "number",
  status: "string (planned, active, completed, cancelled)",
  itinerary: [
    {
      day: "number",
      activities: [
        {
          time: "string",
          activity: "string",
          location: "string",
          notes: "string"
        }
      ]
    }
  ],
  totalCost: "number",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 4. `favorites` Collection
Stores user's favorite destinations.

**Schema:**
```javascript
{
  id: "auto-generated",
  userId: "string (Firebase Auth UID)",
  destinationId: "string",
  createdAt: "timestamp"
}
```

### 5. `reviews` Collection
Stores user reviews for destinations.

**Schema:**
```javascript
{
  id: "auto-generated",
  userId: "string (Firebase Auth UID)",
  destinationId: "string",
  rating: "number (1-5)",
  title: "string",
  content: "string",
  photos: ["string (URL)"],
  helpful: "number",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Utility Functions

### Destinations
- `getAllDestinations(limitCount)` - Get all destinations
- `getDestinationsByCategory(category)` - Filter by category
- `getDestinationById(destinationId)` - Get single destination
- `addDestination(destinationData)` - Add new destination
- `updateDestination(destinationId, updateData)` - Update destination
- `deleteDestination(destinationId)` - Delete destination
- `searchDestinations(searchTerm)` - Search destinations

### Users
- `getUserProfile(uid)` - Get user profile
- `createOrUpdateUserProfile(uid, userData)` - Create/update profile
- `updateUserPreferences(uid, preferences)` - Update preferences

### Trips
- `getUserTrips(uid)` - Get user's trips
- `createTrip(tripData)` - Create new trip
- `updateTrip(tripId, updateData)` - Update trip
- `deleteTrip(tripId)` - Delete trip

### Favorites
- `getUserFavorites(uid)` - Get user's favorites
- `addToFavorites(uid, destinationId)` - Add to favorites
- `removeFromFavorites(uid, destinationId)` - Remove from favorites
- `isDestinationFavorited(uid, destinationId)` - Check if favorited

### Reviews
- `getDestinationReviews(destinationId)` - Get destination reviews
- `addReview(reviewData)` - Add review

## Custom Hooks

### useDestinations()
```javascript
import { useDestinations } from '../hooks/useDestinations';

const { destinations, loading, error } = useDestinations();
```

### useUser()
```javascript
import { useUser } from '../hooks/useUser';

const { 
  user, 
  userProfile, 
  loading, 
  error, 
  updateProfile,
  updatePreferences,
  isAuthenticated 
} = useUser();
```

### useUserFavorites()
```javascript
import { useUserFavorites } from '../hooks/useUser';

const { 
  favorites, 
  loading, 
  error, 
  fetchFavorites,
  addFavorite,
  removeFavorite,
  checkIsFavorited 
} = useUserFavorites();
```

## Migration from Local Data

### Step 1: Run Migration Script
```javascript
import migrateData from '../scripts/migrateToFirestore';

// Run once to migrate your local destinations.json to Firestore
await migrateData();
```

### Step 2: Update Components
Replace local data imports with Firestore hooks:

**Before:**
```javascript
import listingData from './../../data/destinations.json';
```

**After:**
```javascript
import { useDestinations } from '../hooks/useDestinations';

const { destinations, loading, error } = useDestinations();
```

## Real-time Updates

The hooks automatically set up real-time listeners for data changes:

```javascript
// Destinations will automatically update when data changes in Firestore
const { destinations } = useDestinations();

// User profile will update when authentication state changes
const { userProfile } = useUser();
```

## Security Rules

Add these Firestore security rules to your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read destinations
    match /destinations/{destinationId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Users can manage their own trips
    match /trips/{tripId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can manage their own favorites
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Anyone can read reviews, authenticated users can write
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Best Practices

1. **Error Handling**: Always wrap Firestore operations in try-catch blocks
2. **Loading States**: Use the loading states provided by hooks
3. **Real-time Updates**: Leverage the built-in real-time listeners
4. **Batch Operations**: Use batch writes for multiple operations
5. **Security**: Implement proper security rules
6. **Indexing**: Create composite indexes for complex queries

## Additional Collections (Future Enhancements)

Consider adding these collections as your app grows:

- `bookings` - Store booking information
- `payments` - Track payment transactions
- `notifications` - User notifications
- `analytics` - Usage analytics
- `content` - Dynamic content (banners, promotions)

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check Firestore security rules
2. **Missing Indexes**: Create required composite indexes
3. **Real-time Not Working**: Ensure proper cleanup of listeners
4. **Data Not Loading**: Check network connectivity and Firebase config

### Debug Tips

```javascript
// Enable Firestore debug logging
import { connectFirestoreEmulator } from 'firebase/firestore';

if (__DEV__) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## Performance Optimization

1. **Pagination**: Use `limit()` for large datasets
2. **Caching**: Implement local caching strategies
3. **Indexes**: Create indexes for frequently queried fields
4. **Batch Operations**: Group multiple operations together
5. **Offline Support**: Enable offline persistence

```javascript
// Enable offline persistence
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Disable network for offline mode
await disableNetwork(db);

// Re-enable network
await enableNetwork(db);
``` 