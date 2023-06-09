import "../../index.css"
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
const TextCarousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const texts = ['event', 'invite', 'social'];
  
    const nextSlide = () => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % texts.length);
    };
    useEffect(() => {
        const interval = setInterval(nextSlide, 2000);
    
        return () => {
          clearInterval(interval);
        };
      });
    
    return (
      <span className="relative">
        <TransitionGroup className="inline">
          <CSSTransition
            key={activeIndex}
            timeout={300}
            classNames="slide"
            exit={false}
          >
            <span className='mb-4 from-[#D700EA]/70 from-20% via-[#0A5DEA] via-50% to-[#D700EA]/70 to-80% bg-gradient-to-bl bg-clip-text text-transparent'>{texts[activeIndex]}</span>
            {/* <h1 className="text-4xl font-bold mb-4">{texts[activeIndex]}</h1> */}
          </CSSTransition>
        </TransitionGroup>
      </span>
    );
  };
  
  export default TextCarousel;
  