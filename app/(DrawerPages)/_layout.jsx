import { Stack } from 'expo-router';
import React from 'react';

export default function DrawerPagesLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
} 