import { ReactNode } from 'react';
import cx from 'classnames';

import '../styles/message.scss';

type MessageProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Message({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: MessageProps) {
  return (
    <div 
    className={cx(
      'message',
      { answered: isAnswered },
      { highlighted: isHighlighted && !isAnswered },
    )}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}