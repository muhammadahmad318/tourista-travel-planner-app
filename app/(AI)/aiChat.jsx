import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";

const AIChat = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {
            id: 1,
            type: "ai",
            message: "Hello! I'm your AI travel assistant. How can I help you plan your next adventure?",
            timestamp: new Date().toLocaleTimeString(),
        },
    ]);

    const generateAIResponse = async (userMessage) => {
        try {
            const apiKey = process.env.EXPO_PUBLIC_GEMENI_API_KEY;
            if (!apiKey) {
                throw new Error("Gemini API key not found");
            }

            const prompt = `You are a helpful travel assistant. Respond to the following travel-related question in a friendly and informative way. Keep your response concise and practical:

${userMessage}`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error("Invalid API response");
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error generating AI response:", error);
            return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
        }
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            const userMessage = message.trim();
            setMessage("");
            setIsLoading(true);

            // Add user message to chat
            const newUserMessage = {
                id: chatHistory.length + 1,
                type: "user",
                message: userMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            setChatHistory(prev => [...prev, newUserMessage]);

            try {
                // Generate AI response
                const aiResponse = await generateAIResponse(userMessage);

                // Add AI response to chat
                const newAIMessage = {
                    id: chatHistory.length + 2,
                    type: "ai",
                    message: aiResponse,
                    timestamp: new Date().toLocaleTimeString(),
                };
                setChatHistory(prev => [...prev, newAIMessage]);
            } catch (error) {
                console.error("Error in chat:", error);
                // Add error message to chat
                const errorMessage = {
                    id: chatHistory.length + 2,
                    type: "ai",
                    message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
                    timestamp: new Date().toLocaleTimeString(),
                };
                setChatHistory(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        router.back();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 20,
            backgroundColor: theme.backgroundSecondary,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        headerContent: {
            flexDirection: "row",
            alignItems: "center",
        },
        aiAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.primary + '20',
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.text,
        },
        menuButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        chatContainer: {
            flex: 1,
        },
        messagesContainer: {
            flex: 1,
            paddingHorizontal: 20,
        },
        messagesContent: {
            paddingVertical: 20,
        },
        messageContainer: {
            marginBottom: 16,
        },
        userMessage: {
            alignItems: "flex-end",
        },
        aiMessage: {
            alignItems: "flex-start",
        },
        messageBubble: {
            maxWidth: "80%",
            padding: 16,
            borderRadius: 20,
            shadowColor: theme.text,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        userBubble: {
            backgroundColor: theme.primary,
            borderBottomRightRadius: 8,
        },
        aiBubble: {
            backgroundColor: theme.backgroundSecondary,
            borderBottomLeftRadius: 8,
        },
        messageText: {
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 4,
        },
        userText: {
            color: theme.white,
        },
        aiText: {
            color: theme.text,
        },
        timestamp: {
            fontSize: 12,
            opacity: 0.7,
        },
        userTimestamp: {
            color: theme.white + 'B3', // 70% opacity
        },
        aiTimestamp: {
            color: theme.textTertiary,
        },
        inputContainer: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 25,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: theme.border,
        },
        textInput: {
            flex: 1,
            fontSize: 16,
            color: theme.text,
            maxHeight: 100,
            paddingVertical: 8,
        },
        sendButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
        },
        sendButtonActive: {
            backgroundColor: theme.primary,
        },
        sendButtonInactive: {
            backgroundColor: theme.backgroundTertiary,
        },
        loadingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
        },
        loadingDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            opacity: 0.7,
        },
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.aiAvatar}>
                        <Ionicons name="sparkles" size={20} color={theme.primary} />
                    </View>
                    <Text style={styles.headerTitle}>AI Travel Assistant</Text>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    style={styles.messagesContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.messagesContent}
                >
                    {chatHistory.map((chat) => (
                        <View
                            key={chat.id}
                            style={[
                                styles.messageContainer,
                                chat.type === "user" ? styles.userMessage : styles.aiMessage
                            ]}
                        >
                            <View style={[
                                styles.messageBubble,
                                chat.type === "user" ? styles.userBubble : styles.aiBubble
                            ]}>
                                <Text style={[
                                    styles.messageText,
                                    chat.type === "user" ? styles.userText : styles.aiText
                                ]}>
                                    {chat.message}
                                </Text>
                                <Text style={[
                                    styles.timestamp,
                                    chat.type === "user" ? styles.userTimestamp : styles.aiTimestamp
                                ]}>
                                    {chat.timestamp}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Section */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask me about travel destinations..."
                            placeholderTextColor={theme.textTertiary}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            maxLength={500}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                message.trim() && !isLoading ? styles.sendButtonActive : styles.sendButtonInactive
                            ]}
                            onPress={handleSendMessage}
                            disabled={!message.trim() || isLoading}
                        >
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <View style={[styles.loadingDot, { backgroundColor: theme.textTertiary }]} />
                                    <View style={[styles.loadingDot, { backgroundColor: theme.textTertiary }]} />
                                    <View style={[styles.loadingDot, { backgroundColor: theme.textTertiary }]} />
                                </View>
                            ) : (
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={message.trim() ? theme.white : theme.textTertiary}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AIChat; 