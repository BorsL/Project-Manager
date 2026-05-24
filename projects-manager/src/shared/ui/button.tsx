import type { LucideIcon } from 'lucide-react-native';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PropsWithChildren<{
  label?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  className?: string;
  onPress?: () => void;
}>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent',
  secondary: 'bg-accent-soft',
  ghost: 'bg-transparent border border-line',
  danger: 'bg-danger',
};

const textClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-accent',
  ghost: 'text-ink',
  danger: 'text-white',
};

export function Button({
  label,
  variant = 'primary',
  disabled,
  loading,
  icon: Icon,
  className = '',
  children,
  onPress,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      className={`min-h-11 flex-row items-center justify-center gap-2 rounded-usm px-4 py-3 ${
        variantClasses[variant]
      } ${disabled ? 'opacity-50' : ''} ${className}`}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' || variant === 'ghost' ? '#256D85' : '#FFFFFF'}
        />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {Icon ? (
            <Icon
              color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#256D85'}
              size={18}
            />
          ) : null}
          {label ? (
            <Text className={`font-semibold ${textClasses[variant]}`}>{label}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
}
