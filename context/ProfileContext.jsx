import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useContext, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

const ProfileContext = createContext();

// Create a default profile icon component
const DefaultProfileIcon = ({ size = 120 }) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundSecondary,
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: theme.border
        }}>
            <Ionicons name="person" size={size * 0.6} color={theme.icon} />
        </View>
    );
};

export const ProfileProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState(null); // null indicates using default icon

    return (
        <ProfileContext.Provider value={{ profileImage, setProfileImage, DefaultProfileIcon }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}; 