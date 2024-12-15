import { ImageBackground } from 'react-native';
import { IconArrowLeft } from '@tabler/icons-react-native';

import { router } from 'expo-router';

import { Button } from '@/components/button';

import { styles } from './styles';
import { View } from 'react-native';

type Props = {
  uri: string;
};

export function Cover({ uri }: Props) {
  return (
    <ImageBackground
      source={{ uri }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Button
          style={{ width: 40, height: 40 }}
          onPress={() => router.back()}
        >
          <Button.Icon icon={IconArrowLeft} />
        </Button>
      </View>
    </ImageBackground>
  );
}
