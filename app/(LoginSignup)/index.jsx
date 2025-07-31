import { signIn } from '@/components/functions';
import { Colors } from '@/constants/Colors';
import { auth } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';


const LoginScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const user = await signIn(email, password);
            if (user) {
                router.replace("/(tabs)");
            }
        } catch (error) {
            let errorMessage = 'An error occurred during login';
            let errorTitle = 'Login Failed';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorTitle = 'Account Not Found';
                    errorMessage = 'No account exists with this email address. Would you like to create a new account?';
                    Alert.alert(
                        errorTitle,
                        errorMessage,
                        [
                            {
                                text: 'Create Account',
                                onPress: () => {
                                    router.push('/(LoginSignup)/register');
                                }
                            },
                            {
                                text: 'Try Again',
                                onPress: () => {
                                    setEmail('');
                                    setPassword('');
                                    setIsLoading(false);
                                }
                            }
                        ]
                    );
                    return;

                case 'auth/wrong-password':
                    errorTitle = 'Incorrect Password';
                    errorMessage = 'The password you entered is incorrect. Would you like to reset your password?';
                    Alert.alert(
                        errorTitle,
                        errorMessage,
                        [
                            {
                                text: 'Reset Password',
                                onPress: () => {
                                    handleForgotPassword();
                                }
                            },
                            {
                                text: 'Try Again',
                                onPress: () => {
                                    setPassword('');
                                    setIsLoading(false);
                                }
                            }
                        ]
                    );
                    return;

                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address';
                    break;

                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please check your credentials';
                    break;

                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later';
                    break;

                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection';
                    break;

                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled. Please contact support';
                    break;

                default:
                    errorMessage = 'Please check your credentials and try again';
            }

            Alert.alert(
                errorTitle,
                errorMessage,
                [
                    {
                        text: 'Retry',
                        onPress: () => {
                            setPassword('');
                            setIsLoading(false);
                        }
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    }
                ]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address to reset password');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Reset Email Sent',
                'Please check your email for password reset instructions',
                [{ text: 'OK' }]
            );
        } catch (error) {
            let errorMessage = 'Failed to send reset email';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection';
                    break;
            }

            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={colorScheme === 'dark'
                    ? [theme.backgroundSecondary, theme.backgroundTertiary, theme.primary + '20']
                    : [theme.backgroundSecondary, theme.backgroundTertiary, theme.primary + '10']
                }
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={[styles.logoContainer, { backgroundColor: theme.primary + '20' }]}>
                            <Ionicons name="person" size={60} color={theme.primary} />
                        </View>
                        <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sign in to continue your journey</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        {/* Email Input */}
                        <View style={[styles.inputContainer, { width: '100%', maxWidth: 400, alignSelf: 'center' }]}>
                            <View style={[styles.inputWrapper, {
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.inputBorder
                            }]}>
                                <Ionicons name="mail" size={20} color={theme.icon} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.textInput, { color: theme.inputText }]}
                                    placeholder="Email address"
                                    placeholderTextColor={theme.inputPlaceholder}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={[styles.inputContainer, { width: '100%', maxWidth: 400, alignSelf: 'center' }]}>
                            <View style={[styles.inputWrapper, {
                                backgroundColor: theme.inputBackground,
                                borderColor: theme.inputBorder
                            }]}>
                                <Ionicons name="lock-closed" size={20} color={theme.icon} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.textInput, { color: theme.inputText }]}
                                    placeholder="Password"
                                    placeholderTextColor={theme.inputPlaceholder}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={theme.icon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={[styles.forgotPassword, { width: '100%', maxWidth: 400, alignSelf: 'center' }]} onPress={handleForgotPassword}>
                            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled, { width: '100%', maxWidth: 400, alignSelf: 'center' }]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={[theme.primary, theme.accent]}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {isLoading ? (
                                    <Text style={[styles.buttonText, { color: theme.white }]}>Signing In...</Text>
                                ) : (
                                    <>
                                        <Ionicons name="log-in" size={20} color={theme.white} />
                                        <Text style={[styles.buttonText, { color: theme.white }]}>Sign In</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>



                        {/* Sign Up Link */}
                        <View style={styles.signUpContainer}>
                            <Text style={[styles.signUpText, { color: theme.textSecondary }]}>Don&apos;t have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(LoginSignup)/register')}>
                                <Text style={[styles.signUpLink, { color: theme.primary }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
    },
    eyeIcon: {
        padding: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        alignItems: 'center',
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',

    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    signUpLink: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textDecorationLine: 'underline',
    },
});

