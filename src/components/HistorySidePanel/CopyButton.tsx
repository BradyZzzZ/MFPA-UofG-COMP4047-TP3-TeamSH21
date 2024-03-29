/**
 * Button to copy the text to the clipboard.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { useEffect, useState } from 'react';

import { Tooltip } from '@nextui-org/react';
import { GoCheck, GoCopy } from 'react-icons/go';

interface CopyButtonProps {
  text: string;
}

const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [animation, setAnimation] = useState('animate-fade-in');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setAnimation('animate-fade-in');
    setCopied(true);
    setTimeout(() => setCopied(false), 600);
  };

  useEffect(() => {
    setAnimation('');
  }, []);

  return (
    <Tooltip
      content={`${copied ? 'Copied' : 'Copy'}`}
      delay={400}
      closeDelay={0}
      isOpen={copied ? true : undefined}
    >
      <button
        className="btn btn-ghost h-fit min-h-0 p-0 *:text-lg *:text-neutral-600"
        onClick={handleCopy}
      >
        {copied ? (
          <GoCheck className="animate-scale-in-center" />
        ) : (
          <GoCopy className={animation} />
        )}
      </button>
    </Tooltip>
  );
};

export default CopyButton;
