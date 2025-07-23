import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

interface StreamingTextProps {
  content: string;
  speed?: number; // 打字速度，毫秒/字符
  onComplete?: () => void;
}

const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  speed = 30,
  onComplete,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [content, currentIndex, speed, onComplete]);

  return (
    <Typography
      variant="body1"
      component="div"
      sx={{
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        '& p': {
          marginTop: 2,
          marginBottom: 2,
        },
      }}
    >
      {displayedContent}
      <span className="cursor-blink">|</span>
    </Typography>
  );
};

export default StreamingText;