import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockMqttService } from '../mock/mockMqttService';

const { width, height } = Dimensions.get('window');

type ImageSource = { uri: string };

const Carousel: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<ImageSource[]>([]);

  useEffect(() => {
    // Conecta ao serviço MQTT se ainda não estiver conectado
    mockMqttService.connect();

    // Inscreve-se para receber atualizações de imagens
    mockMqttService.subscribeToImages((message) => {
      setImages(message.images);
    });

    // Timer para rotação automática das imagens
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Atualiza o índice quando o número de imagens mudar
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length]);

  const handlePress = () => {
    navigation.navigate('Rating' as never);
  };

  if (images.length === 0) {
    return null; // ou um componente de loading
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.viewPager}>
      <View style={[styles.page, { transform: [{ translateX: -currentIndex * width }] }]}>
        {images.map((image, index) => (
          <View key={index} style={[styles.page, { position: 'absolute', left: index * width }]}>
            <Image 
              source={image} 
              style={styles.image}
              onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
            />
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
    overflow: 'hidden',
  },
  page: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Carousel;