import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useProfile } from '../../context/ProfileContext';
import { auth } from '../../firebaseConfig';

export default function SettingsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const user = auth.currentUser;
    const { profileImage, setProfileImage, DefaultProfileIcon } = useProfile();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            Alert.alert('Success', 'Profile picture updated for this session!');
        }
    };

    const handleUpdateProfile = async () => {
        try {
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
            }
            Alert.alert('Success', 'Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
    };

    const handleUpdateEmail = async () => {
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updateEmail(user, email);
            Alert.alert('Success', 'Email updated successfully!');
            setCurrentPassword('');
        } catch (error) {
            Alert.alert('Error', 'Failed to update email. Please check your current password and try again.');
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            Alert.alert('Success', 'Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            Alert.alert('Error', 'Failed to update password. Please check your current password and try again.');
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile Settings</Text>

                <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <DefaultProfileIcon size={120} />
                    )}
                    <View style={styles.editIconContainer}>
                        <Ionicons name="camera" size={20} color={Colors.light.white} />
                    </View>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Display Name</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.cardBackground,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        value={displayName}
                        onChangeText={setDisplayName}
                        placeholder="Enter display name"
                        placeholderTextColor={theme.textSecondary}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleUpdateProfile}
                >
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Settings</Text>

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.cardBackground,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter new email"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>Current Password</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.cardBackground,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter current password"
                        placeholderTextColor={theme.textSecondary}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleUpdateEmail}
                >
                    <Text style={styles.buttonText}>Update Email</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.cardBackground,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor={theme.textSecondary}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleUpdatePassword}
                >
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: Colors.light.primary,
        padding: 8,
        borderRadius: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: Colors.light.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 