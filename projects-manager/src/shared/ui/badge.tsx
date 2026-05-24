import { Text } from 'react-native';

type BadgeProps = {
  label: string;
  color?: string;
  backgroundColor?: string;
};

export function Badge({ label, color = '#256D85', backgroundColor = '#D9EDF2' }: BadgeProps) {
  return (
    <Text
      className="self-start overflow-hidden rounded-full px-3 py-1 text-xs font-semibold"
      style={{ color, backgroundColor }}
    >
      {label}
    </Text>
  );
}
