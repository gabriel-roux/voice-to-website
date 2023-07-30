import { useEffect, useState } from "react";

interface TypingAnimationProps {
  text: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let i = 0;

    const addLetter = () => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
        timeoutId = setTimeout(addLetter, 40);
      }
    };

    addLetter();

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [text]);

  return <p className="font-normal">{displayedText}</p>;
};


export default TypingAnimation;