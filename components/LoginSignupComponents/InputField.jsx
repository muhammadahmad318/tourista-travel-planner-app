import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

const InputField = ({ icon, inputMode, placeholder, value, onChangeText, secureTextEntry = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={[
            inputStyles.inputSection,
            {
                width: "100%",
                backgroundColor: theme.background,
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isFocused ? 0.1 : 0,
                shadowRadius: 8,
                elevation: isFocused ? 4 : 0,
            }
        ]}>
            <View style={[
                inputStyles.inputLogo,
                { backgroundColor: isFocused ? theme.primary + '10' : 'transparent' }
            ]}>
                {icon}
            </View>
            <TextInput
                inputMode={inputMode}
                style={[
                    inputStyles.inputTag,
                    {
                        backgroundColor: theme.background,
                        borderColor: isFocused ? theme.primary : theme.icon + '40',
                        color: theme.text,
                    }
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.icon + '80'}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry && !showPassword}
                selectionColor={theme.primary}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {secureTextEntry && (
                <TouchableOpacity
                    style={[
                        inputStyles.eyeIcon,
                        { backgroundColor: isFocused ? theme.primary + '10' : 'transparent' }
                    ]}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color={theme.primary}
                        style={{ opacity: 0.7 }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default InputField
const inputStyles = StyleSheet.create({
    inputSection: {
        display: "flex",
        flexDirection: "row",
        height: 52,
        borderRadius: 16,
        maxWidth: 320,
        marginVertical: 10,
        position: 'relative',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    inputTag: {
        borderWidth: 1.5,
        paddingLeft: 55,
        paddingRight: 45,
        borderRadius: 16,
        width: "100%",
        zIndex: 1,
        fontSize: 16,
        height: '100%',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    inputLogo: {
        position: "absolute",
        left: 16,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        width: 32,
        borderRadius: 12,
    },
    eyeIcon: {
        position: "absolute",
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
        width: 36,
        height: '100%',
        borderRadius: 12,
    },
});