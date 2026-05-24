import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  tone?: 'default' | 'danger' | 'accent';
  onPress?: () => void;
};

const toneColor = {
  default: '#181C18',
  danger: '#B74343',
  accent: '#256D85',
};

export function IconButton({
  icon: Icon,
  label,
  disabled,
  tone = 'default',
  onPress,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      className={`h-11 w-11 items-center justify-center rounded-usm border border-line bg-surface ${
        disabled ? 'opacity-40' : ''
      }`}
      onPress={onPress}
    >
      <Icon color={toneColor[tone]} size={19} />
    </Pressable>
  );
}
