import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'section';
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  as: Tag = 'div',
  style,
}) => {
  return (
    <Tag className={`card ${hover ? 'card-hover' : ''} ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
};

export default Card;
