import { Pressable, Text, View } from 'react-native';

export type SegmentOption<Value extends string> = {
  label: string;
  value: Value;
};

type SegmentedTabsProps<Value extends string> = {
  value: Value;
  options: SegmentOption<Value>[];
  onChange: (value: Value) => void;
};

export function SegmentedTabs<Value extends string>({
  value,
  options,
  onChange,
}: SegmentedTabsProps<Value>) {
  return (
    <View className="flex-row rounded-usm border border-line bg-surface-muted p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={`min-h-10 flex-1 items-center justify-center rounded-md px-3 ${
              selected ? 'bg-surface' : ''
            }`}
            key={option.value}
            onPress={() => onChange(option.value)}
          >
            <Text className={`text-sm font-semibold ${selected ? 'text-ink' : 'text-muted'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
