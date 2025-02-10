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
      {
        uri: "https://www.grupotapajos.com.br/wp-content/uploads/2022/01/logo-tapajos-distribuidora.webp",
      },
      {
        uri: "https://grupotapajos.com.br/wp-content/uploads/2022/01/logo-santo-remedio.webp",
      },
      {
        uri: "https://grupotapajos.com.br/wp-content/uploads/2022/01/thumb-lgpd-grupo-tapajos.webp",
      },
    ],
  };

  connect() {
    console.log("Mock MQTT conectado");
    this.simulateIncomingPedido();

    this.notifyImageSubscribers();

    setInterval(() => {
      this.simulateNewImages();
    }, 30000);
  }

  private simulateIncomingPedido() {
    this.currentPedido = {
      id: Math.random().toString(36).substring(7),
      id_pedido: Math.random().toString(36).substring(7),
    };
  }

  sendVotacao(votacao: number) {
    if (!this.currentPedido) return;

    const message: VotacaoMessage = {
      ...this.currentPedido,
      votacao,
    };

    console.log("Enviando votação:", message);
    this.votacaoSubscribers.forEach((callback) => callback(message));

    this.simulateIncomingPedido();

    return message;
  }

  getCurrentPedido() {
    return this.currentPedido;
  }

  subscribeToVotacao(callback: MessageCallback<VotacaoMessage>) {
    this.votacaoSubscribers.push(callback);
  }

  subscribeToImages(callback: MessageCallback<ImageMessage>) {
    this.imageSubscribers.push(callback);

    callback(this.currentImages);
  }

  private simulateNewImages() {
    const newImages: ImageMessage = {
      images: [
        { uri: `https://exemplo.com/imagem${Math.random()}.jpg` },
        { uri: `https://exemplo.com/imagem${Math.random()}.jpg` },
        { uri: `https://exemplo.com/imagem${Math.random()}.jpg` },
      ],
    };

    this.currentImages = newImages;
    this.notifyImageSubscribers();
  }

  private notifyImageSubscribers() {
    this.imageSubscribers.forEach((callback) => callback(this.currentImages));
  }

  simulateMessage() {
    const mockMessage: VotacaoMessage = {
      id: Math.random().toString(36).substring(7),
      id_pedido: Math.random().toString(36).substring(7),
      votacao: 0,
    };

    this.votacaoSubscribers.forEach((callback) => callback(mockMessage));
  }
}

export const mockMqttService = new MockMqttService();
