import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = '', multiline, ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-sm font-semibold text-ink">{label}</Text> : null}
      <TextInput
        className={`rounded-usm border border-line bg-surface px-3 py-3 text-base text-ink ${
          multiline ? 'min-h-28 align-top' : 'min-h-11'
        } ${className}`}
        multiline={multiline}
        placeholderTextColor="#8A8F87"
        {...props}
      />
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
