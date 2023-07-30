import { Microphone, PaperPlaneTilt } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import TypingAnimation from '../transcript';
import TextareaAutosize from 'react-textarea-autosize';

interface TranscriptProps {
  text: string;
  role: 'user' | 'bot';
}

export default function ChatBot() {

  const [transcripts, setTranscripts] = useState<TranscriptProps[]>([]);
  const [recognition, setRecognition] = useState({} as SpeechRecognition);
  const [isListening, setIsListening] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcripts, loading]);

  async function sendMessageToGPT(message: string): Promise<string> {
    try {
      setLoading(true)

      const response = await fetch('http://localhost:3005/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false)

      return data.response
    } catch (error) {
      setLoading(false)
      console.error(error);
      return 'Desculpe, houve um erro ao processar sua solicitação.';
    }
  }


  function speak(text: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';

    // Seleciona uma voz nativa do sistema
    const voices = synth.getVoices();
    utterance.rate = 1.5
    utterance.voice = voices.find((voice) => voice.lang === 'pt-BR')!;

    synth.speak(utterance);
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Seu navegador não suporta o reconhecimento de voz.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'pt-BR';

    recognitionInstance.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscripts((prevTranscripts) => prevTranscripts.concat({ role: 'user', text: transcript }));

      // Chama API do ChatGPT e adicione a resposta ao array de transcripts
      const gptResponse = await sendMessageToGPT(transcript);

      console.log(gptResponse)
      setTranscripts((prevTranscripts) => prevTranscripts.concat({ role: 'bot', text: gptResponse }));

      // Fale a resposta do ChatGPT
      speak(gptResponse);
    };

    setRecognition(recognitionInstance);

  }, [transcripts]);

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      recognition.start();
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <div className="flex flex-col h-screen items-center space-y-4 justify-between pb-4">
      <div className="relative">
        <img src="/vortex.svg" alt="Vortex" className="rotateVortex w-96 h-96 opacity-40" />
      </div>
      <div className='w-full overflow-y-auto' ref={messagesRef}>
        {
          transcripts.map((transcript, index) => (
            <div key={index} className="mb-8 w-full p-4 bg-blue-light text-left text-white rounded-md">
              {transcript.role === 'bot' && <TypingAnimation text={transcript.text} />}
              {transcript.role === 'user' && transcript.text}
            </div>
          ))
        }
        {
          loading && (
            <div className="mb-8 w-full p-4 bg-blue-light text-center text-white rounded-md">
              <BeatLoader
                size={16}
                color='#00cece'
              />
            </div>
          )
        }
      </div>
      <div className="w-full flex justify-center items-center space-x-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTranscripts((prevTranscripts) => prevTranscripts.concat({ role: 'user', text: inputMessage }));
            sendMessageToGPT(inputMessage).then((response) => {
              setTranscripts((prevTranscripts) => prevTranscripts.concat({ role: 'bot', text: response }));
              speak(response);
            });
            setInputMessage('')
          }}
          className="relative border-2 border-indigo-500 rounded-lg px-4 py-2 w-1/2"
        >
          <TextareaAutosize
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full h-full focus:outline-none bg-transparent resize-none pr-5 overflow-hidden"
            placeholder="Digite sua mensagem"
            minRows={1}
            maxRows={4}
          />
          <button
            className="absolute right-2 bottom-0 transform -translate-y-1/2 text-indigo-500"
          >
            <PaperPlaneTilt className="w-6 h-6" />
          </button>
        </form>
        <button
          className={`${isListening ? 'pulse' : ''
            } bg-indigo-500 p-4 text-white rounded-full flex justify-center items-center transition-all hover:bg-blue-700`}
          onClick={handleVoiceInput}
        >
          <Microphone className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}