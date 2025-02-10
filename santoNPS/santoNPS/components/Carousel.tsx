import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type ImageSource = { uri: string };

const Carousel: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const images: ImageSource[] = [
    { uri: 'https://www.grupotapajos.com.br/wp-content/uploads/2022/01/logo-tapajos-distribuidora.webp' },
    { uri: 'https://grupotapajos.com.br/wp-content/uploads/2022/01/logo-santo-remedio.webp' },
    { uri: 'https://grupotapajos.com.br/wp-content/uploads/2022/01/thumb-lgpd-grupo-tapajos.webp' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  const handlePress = () => {
    navigation.navigate('Rating' as never);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.viewPager}>
      <View style={[styles.page, { transform: [{ translateX: -currentIndex * width }] }]}>
        {images.map((image, index) => (
          <View key={index} style={[styles.page, { position: 'absolute', left: index * width }]}>
            <Image source={image} style={styles.image} />
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