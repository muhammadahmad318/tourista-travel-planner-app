/**
 * Modern green-themed color palette for the app with light and dark mode support.
 * Colors are designed for optimal contrast, accessibility, and visual appeal.
 */

// Primary brand colors - Green theme
const primaryLight = "#059669"; // Emerald green
const primaryDark = "#10B981"; // Lighter emerald for dark mode

// Accent colors - Complementary teal
const accentLight = "#0D9488"; // Teal
const accentDark = "#14B8A6"; // Lighter teal for dark mode

// Success colors - Different shade of green
const successLight = "#16A34A"; // Green
const successDark = "#22C55E"; // Lighter green for dark mode

// Error colors - Warm red
const errorLight = "#DC2626"; // Red
const errorDark = "#EF4444"; // Lighter red for dark mode

// Warning colors - Warm orange
const warningLight = "#D97706"; // Orange
const warningDark = "#F59E0B"; // Lighter orange for dark mode

export const Colors = {
  light: {
    // Brand colors
    primary: primaryLight,
    accent: accentLight,

    // Text colors
    text: "#1F2937", // Dark gray for primary text
    textSecondary: "#4B5563", // Medium gray for secondary text
    textTertiary: "#6B7280", // Light gray for tertiary text

    // Background colors
    background: "#FFFFFF", // Pure white
    backgroundSecondary: "#F0FDF4", // Very light green tint
    backgroundTertiary: "#ECFDF5", // Slightly darker green tint

    // Border and divider colors
    border: "#D1FAE5", // Light green for borders
    divider: "#A7F3D0", // Medium green for dividers

    // Status colors
    success: successLight,
    error: errorLight,
    warning: warningLight,

    // Icon colors
    icon: "#059669", // Primary green for icons
    iconSelected: primaryLight,

    // Tab bar colors
    tabIconDefault: "#6B7280",
    tabIconSelected: primaryLight,

    // Other
    white: "#FFFFFF",
    black: "#000000",
    overlay: "rgba(5, 150, 105, 0.1)", // Green tinted overlay

    // Input field specific
    inputBackground: "#FFFFFF",
    inputBorder: "#D1FAE5",
    inputPlaceholder: "#9CA3AF",
    inputText: "#1F2937",
  },

  dark: {
    // Brand colors
    primary: primaryDark,
    accent: accentDark,

    // Text colors
    text: "#F0FDF4", // Off-white with green tint
    textSecondary: "#D1FAE5", // Light green for secondary text
    textTertiary: "#A7F3D0", // Medium green for tertiary text

    // Background colors
    background: "#00120D", // Dark emerald
    backgroundSecondary: "#065F46", // Slightly lighter dark emerald
    backgroundTertiary: "#047857", // Medium dark emerald

    // Border and divider colors
    border: "#059669", // Primary green for borders
    divider: "#10B981", // Light green for dividers

    // Status colors
    success: successDark,
    error: errorDark,
    warning: warningDark,

    // Icon colors
    icon: "#34D399", // Light green for icons
    iconSelected: primaryDark,

    // Tab bar colors
    tabIconDefault: "#34D399",
    tabIconSelected: primaryDark,

    // Other
    white: "#F0FDF4",
    black: "#000000",
    overlay: "rgba(16, 185, 129, 0.1)", // Green tinted overlay

    // Input field specific
    inputBackground: "#065F46",
    inputBorder: "#059669",
    inputPlaceholder: "#34D399",
    inputText: "#F0FDF4",
  },
};
