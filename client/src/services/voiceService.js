const translations = {
  'en-US': {
    searchingEvents: (city) => `Searching for events in ${city}`,
    noEvents: 'No events found',
    foundEvents: (count) => `Found ${count} events`,
  },
  'fr-FR': {
    searchingEvents: (city) => `Recherche d'événements à ${city}`,
    noEvents: 'Aucun événement trouvé',
    foundEvents: (count) => `${count} événements trouvés`,
  }
};

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.currentLanguage = 'en-US';
    this.isListening = false;
    
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.currentLanguage;
    } else {
      console.warn('Speech recognition not supported');
    }
  }

  setLanguage(language) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
    };

    this.isListening = true;
    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, language = this.currentLanguage) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Speech synthesis not supported');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onend = resolve;
      utterance.onerror = reject;
      this.synthesis.speak(utterance);
    });
  }

  getTranslation(key, params) {
    const translation = translations[this.currentLanguage]?.[key];
    if (typeof translation === 'function') {
      return translation(params);
    }
    return translation || translations['en-US'][key];
  }

  speakTranslation(key, params) {
    const text = this.getTranslation(key, params);
    return this.speak(text);
  }
}

export default new VoiceService();
