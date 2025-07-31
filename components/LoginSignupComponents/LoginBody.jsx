import { Colors } from '@/constants/Colors';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { signIn } from './../functions';
import ButtonUI from './Button-ui';
import InputField from './InputField';

const LoginBody = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { backgroundColor: theme.background }
                ]}
                style={{ backgroundColor: theme.background }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.inputContainer}>
                    <InputField
                        icon={<FontAwesome name="user" size={20} color={theme.primary} />}
                        inputMode="email"
                        placeholder="Username"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <InputField
                        icon={<FontAwesome6 name="key" size={20} color={theme.primary} />}
                        inputMode="password"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => {/* Handle forgot password */ }}
                    >
                        <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttons}>
                    <ButtonUI
                        name="Login"
                        color={theme.white}
                        {...{
                            width: "100%",
                            marginVertical: 8,
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                        }}
                        onClick={() => {
                            signIn(email, password);
                        }}
                    />
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                        <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
                        <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                    </View>
                    <ButtonUI
                        name="Create Account"
                        color={theme.primary}
                        {...{
                            width: "100%",
                            marginVertical: 8,
                            backgroundColor: theme.background,
                            borderColor: theme.primary,
                        }}
                        onClick={() => {
                            router.push("/register");
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default LoginBody

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        paddingTop: 20,
    },
    inputContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    buttons: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    forgotPassword: {
        alignSelf: 'center',
        marginTop: 8,
        padding: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 16,
        justifyContent: 'center',
    },
    divider: {
        flex: 1,
        height: 1,
        maxWidth: 200,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
    },
    scrollContent: {
        flexGrow: 0,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
    },
});

