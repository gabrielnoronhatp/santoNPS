interface VotacaoMessage {
    id: string;
    id_pedido: string;
    votacao: number;
  }
  
  interface ImageMessage {
    images: { uri: string }[];
  }
  
  type MessageCallback<T> = (message: T) => void;
  
  class MockMqttService {
    private votacaoSubscribers: MessageCallback<VotacaoMessage>[] = [];
    private imageSubscribers: MessageCallback<ImageMessage>[] = [];
    private currentPedido: { id: string; id_pedido: string } | null = null;
    private currentImages: ImageMessage = {
      images: [
        { uri: 'https://www.grupotapajos.com.br/wp-content/uploads/2022/01/logo-tapajos-distribuidora.webp' },
        { uri: 'https://grupotapajos.com.br/wp-content/uploads/2022/01/logo-santo-remedio.webp' },
        { uri: 'https://grupotapajos.com.br/wp-content/uploads/2022/01/thumb-lgpd-grupo-tapajos.webp' },
      ]
    };
  
    // Simula a conexão com o broker MQTT
    connect() {
      console.log('Mock MQTT conectado');
      this.simulateIncomingPedido();
      // Simula recebimento inicial das imagens
      this.notifyImageSubscribers();
      
      // Simula atualização periódica das imagens (a cada 30 segundos)
      setInterval(() => {
        this.simulateNewImages();
      }, 30000);
    }
  
    // Simula recebimento de um novo pedido
    private simulateIncomingPedido() {
      this.currentPedido = {
        id: Math.random().toString(36).substring(7),
        id_pedido: Math.random().toString(36).substring(7),
      };
    }
  
    // Método para enviar a votação
    sendVotacao(votacao: number) {
      if (!this.currentPedido) return;
  
      const message: VotacaoMessage = {
        ...this.currentPedido,
        votacao
      };
  
      // Simula o envio da mensagem
      console.log('Enviando votação:', message);
      this.votacaoSubscribers.forEach(callback => callback(message));
      
      // Simula recebimento de um novo pedido após enviar votação
      this.simulateIncomingPedido();
  
      return message;
    }
  
    // Método para obter o pedido atual
    getCurrentPedido() {
      return this.currentPedido;
    }
  
    // Inscreve-se para receber mensagens
    subscribeToVotacao(callback: MessageCallback<VotacaoMessage>) {
      this.votacaoSubscribers.push(callback);
    }
  
    // Inscreve-se para receber imagens
    subscribeToImages(callback: MessageCallback<ImageMessage>) {
      this.imageSubscribers.push(callback);
      // Envia as imagens atuais imediatamente ao se inscrever
      callback(this.currentImages);
    }
  
    private simulateNewImages() {
      // Simula recebimento de novas imagens
      const newImages: ImageMessage = {
        images: [
          { uri: `https://exemplo.com/imagem${Math.random()}.jpg` },
          { uri: `https://exemplo.com/imagem${Math.random()}.jpg` },
          { uri: `https://exemplo.com/imagem${Math.random()}.jpg` },
        ]
      };
      
      this.currentImages = newImages;
      this.notifyImageSubscribers();
    }
  
    private notifyImageSubscribers() {
      this.imageSubscribers.forEach(callback => callback(this.currentImages));
    }
  
    // Simula o envio de uma mensagem
    simulateMessage() {
      const mockMessage: VotacaoMessage = {
        id: Math.random().toString(36).substring(7),
        id_pedido: Math.random().toString(36).substring(7),
        votacao: 0
      };
  
      this.votacaoSubscribers.forEach(callback => callback(mockMessage));
    }
  }
  
  export const mockMqttService = new MockMqttService();