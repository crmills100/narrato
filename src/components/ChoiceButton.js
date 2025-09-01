// src/components/ChoiceButton.js - Animated choice button
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ChoiceButton({ choice, onPress, disabled, style }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.choiceButton,
          disabled && styles.disabledChoice,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.choiceText,
          disabled && styles.disabledChoiceText,
        ]}>
          {choice.text}
        </Text>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={disabled ? "#ccc" : "#6366f1"} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
