import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockMqttService } from '../mock/mockMqttService';

interface VotacaoMessage {
  id: string;
  id_pedido: string;
  votacao: number;
}

const RatingScreen: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [currentPedido, setCurrentPedido] = useState<{ id: string; id_pedido: string } | null>(null);

  useEffect(() => {
    mockMqttService.connect();
    mockMqttService.subscribeToVotacao((message) => {
      saveVotacao(message);
    });

    
    setCurrentPedido(mockMqttService.getCurrentPedido());
  }, []);

  const saveVotacao = async (votacao: VotacaoMessage) => {
    try {
      
      const historico = await AsyncStorage.getItem('votacoes');
      const votacoes: VotacaoMessage[] = historico ? JSON.parse(historico) : [];
      
      
      votacoes.push(votacao);
      
      
      await AsyncStorage.setItem('votacoes', JSON.stringify(votacoes));
      console.log('Votação salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar votação:', error);
    }
  };

  const handleRating = async (value: number) => {
    setRating(value);
    
    if (currentPedido) {
      const votacao = mockMqttService.sendVotacao(value);
      if (votacao) {
        Alert.alert('Sucesso', 'Sua avaliação foi enviada!');
        setRating(0); 
        setCurrentPedido(mockMqttService.getCurrentPedido()); 
      }
    }
  };

  const getEmotionIcon = (value: number) => {
    switch (value) {
      case 1:
        return require('../assets/images/bt1.png');
      case 2:
        return require('../assets/images/bt2.png');
      case 3:
        return require('../assets/images/bt3.png');
      case 4:
        return require('../assets/images/bt4.png');
      case 5:
        return require('../assets/images/bt5.png');
      default:
        return require('../assets/images/bt1.png');
    }
  };

  const getEmotionColor = (value: number) => {
    switch (value) {
      case 1:
        return '#E33E3E'; // Vermelho mais escuro
      case 2:
        return '#F27B1C'; // Laranja mais escuro
      case 3:
        return '#FFB800'; // Amarelo mais escuro
      case 4:
        return '#85C042'; // Verde mais escuro
      case 5:
        return '#4CAF50'; // Verde mais escuro
      default:
        return 'gray';
    }
  };

  const getEmotionTitle = (value: number) => {
    switch (value) {
      case 1:
        return 'Muito\ninsatisfeito';
      case 2:
        return 'Insatisfeito';
      case 3:
        return 'Neutro';
      case 4:
        return 'Satisfeito';
      case 5:
        return 'Muito\nsatisfeito';
      default:
        return '';
    }
  };

  const getVotacoes = async () => {
    try {
      const historico = await AsyncStorage.getItem('votacoes');
      return historico ? JSON.parse(historico) : [];
    } catch (error) {
      console.error('Erro ao obter votações:', error);
      return [];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avalie o Atendimento:</Text>
      {currentPedido && (
        <Text style={styles.pedidoInfo}>
          Pedido: {currentPedido.id_pedido}
        </Text>
      )}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity 
            key={value} 
            onPress={() => handleRating(value)}
            style={[
              styles.emojiContainer,
              rating === value && { borderColor: getEmotionColor(value) }
            ]}
          >
            <Image
              source={getEmotionIcon(value)}
              style={{ 
                width: 100,
                height: 100,
              }}
            />
            <Text
              style={[
                styles.emotionTitle,
                { color: rating === value ? getEmotionColor(value) : 'gray' }
              ]}
            >
              {getEmotionTitle(value)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emojiContainer: {
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
  },
  emotionTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  pedidoInfo: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
});

export default RatingScreen;