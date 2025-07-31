import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FloatingAIButton = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const [position, setPosition] = useState({
        x: screenWidth - 80,
        y: screenHeight / 2 - 30,
    });

    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.8)).current;

    const [isPressed, setIsPressed] = useState(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsPressed(true);
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 0.9,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]).start();
            },
            onPanResponderMove: (_, gestureState) => {
                translateX.setValue(gestureState.dx);
                translateY.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                setIsPressed(false);

                let newX = position.x + gestureState.dx;
                let newY = position.y + gestureState.dy;

                // Keep button within screen bounds
                newX = Math.max(0, Math.min(newX, screenWidth - 60));
                newY = Math.max(100, Math.min(newY, screenHeight - 100));

                setPosition({ x: newX, y: newY });

                // Animate to final position
                Animated.parallel([
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.8,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]).start();
            },
        })
    ).current;

    const handlePress = () => {
        // Navigate directly to AI chat
        router.push('/(AI)/aiChat');
    };

    const animatedStyle = {
        transform: [
            { translateX: translateX },
            { translateY: translateY },
            { scale: scale },
        ],
        opacity: opacity,
    };

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            zIndex: 1000,
        },
        buttonContainer: {
            width: 60,
            height: 60,
        },
        floatingButton: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.primary + 'E6', // 90% opacity
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            borderWidth: 2,
            borderColor: theme.background + '4D', // 30% opacity
        },
        buttonPressed: {
            backgroundColor: theme.primary,
        },
    });

    return (
        <View style={[styles.container, { left: position.x, top: position.y }]}>
            <Animated.View style={[styles.buttonContainer, animatedStyle]}>
                <TouchableOpacity
                    style={[
                        styles.floatingButton,
                        isPressed && styles.buttonPressed,
                    ]}
                    onPress={handlePress}
                    activeOpacity={0.8}
                    {...panResponder.panHandlers}
                >
                    <MaterialCommunityIcons
                        name="chat-processing-outline"
                        size={24}
                        color={theme.white}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default FloatingAIButton; 