import { useState } from 'react';
import voiceService from '../../services/voiceService';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const VoiceSearchButton = ({ onResult, placeholder = "Click to speak" }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    voiceService.startListening(
      (transcript) => {
        onResult(transcript);
        setIsListening(false);
      },
      (error) => {
        console.error('Voice input error:', error);
        toast.error('Voice input failed. Please try again.');
        setIsListening(false);
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      className={`
        inline-flex items-center justify-center
        w-10 h-10 rounded-full
        ${isListening ? 'bg-red-500' : 'bg-indigo-600'}
        text-white
        hover:opacity-90
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      `}
      title={isListening ? "Stop listening" : placeholder}
    >
      {isListening ? (
        <StopIcon className="h-5 w-5" />
      ) : (
        <MicrophoneIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default VoiceSearchButton;
