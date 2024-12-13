import { Pressable, PressableProps, Text } from 'react-native';
import { styles } from './styles';
import { categoriesIcons } from '@/utils/categories-icons';
import { colors } from '@/styles/theme';

type CategoryProps = PressableProps & {
  name: string;
  iconId: string;
  isSelected?: boolean;
};

export function Category({ iconId, name, isSelected = false, ...rest }: CategoryProps) {
  const Icon = categoriesIcons[iconId];
  return (
    <Pressable
      style={[styles.container, isSelected && styles.containerSelected]}
      {...rest}
    >
      <Icon
        size={16}
        color={colors.gray[isSelected ? 100 : 400]}
      />
      <Text style={[styles.name, isSelected && styles.nameSelected]}>{name}</Text>
    </Pressable>
  );
}
