import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RatingScreen: React.FC = () => {
  const [rating, setRating] = useState<number>(0);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const getEmotionIcon = (value: number) => {
    switch (value) {
      case 1:
        return 'sentiment-very-dissatisfied';
      case 2:
        return 'sentiment-dissatisfied';
      case 3:
        return 'sentiment-neutral';
      case 4:
        return 'sentiment-satisfied';
      case 5:
        return 'sentiment-very-satisfied';
      default:
        return 'sentiment-neutral';
    }
  };

  const getEmotionColor = (value: number) => {
    switch (value) {
      case 1:
        return '#FF4444'; // Vermelho
      case 2:
        return '#FF8C00'; // Laranja
      case 3:
        return '#FFD700'; // Amarelo
      case 4:
        return '#90EE90'; // Verde claro
      case 5:
        return '#32CD32'; // Verde
      default:
        return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avalie o Atendimento :</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity key={value} onPress={() => handleRating(value)}>
            <Icon
              name={getEmotionIcon(value)}
              size={50}
              color={rating === value ? 'gray' : getEmotionColor(value)}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //aling in top 
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default RatingScreen;