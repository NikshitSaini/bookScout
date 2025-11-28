import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';

const ThemeToggleButton = ({ compact = false }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const COLORS = theme;
  const styles = createStyles(theme);
  
  // Animation value
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isDark = COLORS.background === '#0a1929'; // Simple check based on background color

  const handlePress = () => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate rotation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    toggleTheme();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.compactButton}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: spin }] }}>
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={24}
            color={COLORS.textPrimary}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.container}
    >
      <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.contentContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={24}
                color={COLORS.white}
            />
            </Animated.View>
            <Text style={styles.text}>
                {isDark ? "Dark Mode" : "Light Mode"}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default ThemeToggleButton;
