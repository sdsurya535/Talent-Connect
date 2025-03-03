import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        const nextCount = Math.floor((progress / duration) * value);
        setCount(nextCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 rounded-md">
      <span className="text-sm text-muted-foreground">filtered:</span>
      <span className="font-medium">{count.toLocaleString()}</span>
    </div>
  );
};
AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
};

export default AnimatedCounter;
