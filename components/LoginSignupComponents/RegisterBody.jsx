import { Colors } from '@/constants/Colors'
import { FontAwesome6 } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, useColorScheme } from 'react-native'
import { signUp } from './../functions'
import ButtonUI from './Button-ui'
import InputField from './InputField'

const RegisterBody = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRepassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const handleSignUp = async () => {
        if (
            password === rePassword &&
            password !== "" &&
            rePassword !== "" &&
            email !== "" &&
            firstName !== "" &&
            lastName !== ""
        ) {
            const result = await signUp(email, password);
            if (result.success) {
                router.replace('/(LoginSignup)');
            }
        } else {
            console.log("====================================");
            console.log("Fields are empty or passwords don't match");
            console.log("====================================");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { backgroundColor: theme.background }
                ]}
                style={{ backgroundColor: theme.background }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inputContainer}>
                    <InputField
                        icon={<MaterialCommunityIcons name="account" size={20} color={theme.primary} />}
                        inputMode="text"
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <InputField
                        icon={<MaterialCommunityIcons name="account" size={20} color={theme.primary} />}
                        inputMode="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <InputField
                        icon={<MaterialCommunityIcons name="email" size={20} color={theme.primary} />}
                        inputMode="email"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <InputField
                        icon={<FontAwesome6 name="key" size={20} color={theme.primary} />}
                        inputMode="text"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <InputField
                        icon={<FontAwesome6 name="key" size={20} color={theme.primary} />}
                        inputMode="text"
                        placeholder="Re-Enter Password"
                        value={rePassword}
                        onChangeText={setRepassword}
                        secureTextEntry={true}
                    />
                </View>

                <View style={styles.buttons}>
                    <ButtonUI
                        name="Create Account"
                        color={theme.white}
                        {...{
                            width: "100%",
                            backgroundColor: theme.primary,
                            borderColor: theme.primary,
                            marginVertical: 8,
                        }}
                        onClick={handleSignUp}
                    />
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                        <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
                        <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                    </View>
                    <ButtonUI
                        name="Sign In"
                        color={theme.primary}
                        {...{
                            width: "100%",
                            backgroundColor: theme.background,
                            borderColor: theme.primary,
                            marginVertical: 8,
                        }}
                        onClick={() => {
                            router.back();
                        }}
                    />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

export default RegisterBody

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 0,
        justifyContent: "center",
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
});