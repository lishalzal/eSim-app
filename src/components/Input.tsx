import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  secure?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  secure = false,
  required = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secure);

  const getContainerStyle = (): ViewStyle => {
    return {
      ...styles.container,
      borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.border,
      ...containerStyle,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      ...styles.input,
      paddingLeft: leftIcon ? SPACING.xl + SPACING.sm : SPACING.md,
      paddingRight: rightIcon || secure ? SPACING.xl + SPACING.sm : SPACING.md,
      ...inputStyle,
    };
  };

  const handleFocus = () => {
    setIsFocused(true);
    textInputProps.onFocus?.(undefined as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    textInputProps.onBlur?.(undefined as any);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getRightIcon = () => {
    if (secure) {
      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
        >
          <Ionicons
            name={rightIcon}
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? COLORS.primary : COLORS.textLight}
            />
          </View>
        )}
        
        <TextInput
          style={getInputStyle()}
          secureTextEntry={secure && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={COLORS.textLight}
          {...textInputProps}
        />
        
        {getRightIcon()}
      </View>
      
      {(error || helper) && (
        <View style={styles.messageContainer}>
          {error && (
            <Text style={[styles.error, errorStyle]}>
              {error}
            </Text>
          )}
          {helper && !error && (
            <Text style={[styles.helper, helperStyle]}>
              {helper}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  labelContainer: {
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  required: {
    color: COLORS.error,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 48,
    ...SHADOWS.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  iconContainer: {
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    marginTop: SPACING.xs,
  },
  error: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
  },
  helper: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
});