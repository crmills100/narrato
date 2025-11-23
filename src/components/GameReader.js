// src/components/GameReader.js - Enhanced game reading component with animations
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function GameReader({ text, style, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typewriterIndex = useRef(0);
  const typewriterInterval = useRef(null);

  useEffect(() => {
    if (text) {
      startTextAnimation();
    }
    return () => {
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
      }
    };
  }, [text]);

  const startTextAnimation = () => {
    // Check if text contains typewriter effect
    if (text.includes('{typewriter}')) {
      startTypewriterEffect();
    } else {
      // Simple fade in
      setDisplayedText(text);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onComplete?.();
      });
    }
  };

  const startTypewriterEffect = () => {
    setIsAnimating(true);
    typewriterIndex.current = 0;
    
    const cleanText = text.replace(/\{typewriter\}([^{]*)\{\/typewriter\}/g, '$1');
    
    fadeAnim.setValue(1);
    
    typewriterInterval.current = setInterval(() => {
      if (typewriterIndex.current < cleanText.length) {
        setDisplayedText(cleanText.substring(0, typewriterIndex.current + 1));
        typewriterIndex.current++;
      } else {
        clearInterval(typewriterInterval.current);
        setIsAnimating(false);
        onComplete?.();
      }
    }, 50);
  };

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      <Text style={styles.gameText}>
        {displayedText}
        {isAnimating && <Text style={styles.cursor}>|</Text>}
      </Text>
    </Animated.View>
  );
}
