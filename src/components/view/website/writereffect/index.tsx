import React, { useState, useEffect } from "react";

type TextWriterProps = {
  texts: string[]; // Array of strings to display
  typingSpeed?: number; // Typing speed in ms
  pauseTime?: number; // Pause time between texts in ms
};

const TextWriter: React.FC<TextWriterProps> = ({
  texts,
  typingSpeed = 100,
  pauseTime = 2000,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[textIndex];
      const updatedText = isDeleting
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1);

      setCurrentText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? typingSpeed / 2 : typingSpeed
    );
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, texts, textIndex, typingSpeed, pauseTime]);

  return (
    <span>
      {currentText}
      <span
        style={{
          borderRight: "2px solid white",
          backgroundColor: "blue",
          width: "3px",
          animation: "", // Tidak ada animasi
        }}
      ></span>
    </span>
  );
};

export default TextWriter;
