import { useEffect, useState, useRef } from 'react';
import { Alert, View, Modal, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { IconScan } from '@tabler/icons-react-native';

import { Loading } from '@/components/loading';
import { Cover } from '@/components/market/cover';
import { Details, DetailProps } from '@/components/market/details';
import { Coupon } from '@/components/market/coupon';
import { Button } from '@/components/button';

import { api } from '@/services/api';

type MarketProps = DetailProps & {
  cover: string;
};

export default function Market() {
  const [market, setMarket] = useState<MarketProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const [couponIsFetching, setCounponIsFetching] = useState(false);

  const [_, requestPermission] = useCameraPermissions();

  const params = useLocalSearchParams<{ id: string }>();

  const qrLock = useRef(false);

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);

      setMarket(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.', [{ text: 'OK', onPress: () => router.back() }]);
    }
  }

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Câmera', 'Para realizar o scan do QRCode é necessário permitir o uso da câmera.');
      }
      qrLock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert('Câmera', 'Não foi possível acessar a câmera.');
    }
  }

  async function getCoupon(id: string) {
    try {
      setCounponIsFetching(true);

      const { data } = await api.patch('/coupons/' + id);

      Alert.alert('Coupon', data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível utilizar o cupom.');
    } finally {
      setCounponIsFetching(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);
    Alert.alert('Copom', 'Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?', [
      { style: 'cancel', text: 'Não' },
      { text: 'Sim', onPress: () => getCoupon(id) },
    ]);
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, coupon]);

  if (isLoading) {
    return <Loading />;
  }

  if (!market) {
    return <Redirect href="/home" />;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar
        barStyle="light-content"
        hidden={isVisibleCameraModal}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={market.cover} />
        <Details data={market} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Icon icon={IconScan} />
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>
      <Modal
        style={{ flex: 1 }}
        visible={isVisibleCameraModal}
      >
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => {
                handleUseCoupon(data);
              }, 500);
            }
          }}
        />
        <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
          <Button
            isLoading={couponIsFetching}
            onPress={() => {
              setIsVisibleCameraModal(false);
            }}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
