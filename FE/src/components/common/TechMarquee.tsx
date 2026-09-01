import React, { useMemo, useState } from 'react';

interface TechMarqueeProps {
  technologies: string[];
  headline?: string;
  className?: string;
}

const TechMarquee: React.FC<TechMarqueeProps> = ({
  technologies,
  headline = 'Technologies used',
  className = '',
}) => {
  const [paused, setPaused] = useState(false);
  const items = useMemo(() => technologies.filter(Boolean), [technologies]);

  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div
      className={`skills-marquee ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="skills-marquee__headline">{headline}</p>
      <div className="skills-marquee__viewport">
        <div className={`skills-marquee__track${paused ? ' skills-marquee__track--paused' : ''}`}>
          {loop.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="skills-marquee__item"
              aria-hidden={i >= items.length}
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                borderRadius: '9999px',
                backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
                WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
              }}
            >
              <span className="skills-marquee__name">{tech}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechMarquee;
