import { View, Text } from 'react-native';
import { IconProps } from '@tabler/icons-react-native';
import { styles } from './styles';
import { colors } from '@/styles/theme';
import { ReactNode } from 'react';

type StepProps = {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
};

export function Step({ title, description, icon: Icon }: StepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        {Icon && (
          <Icon
            size={32}
            color={colors.red.base}
          />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}
