import { useState } from 'react';

const useHover = () => {
  const [hovering, setHovering] = useState(false);

  const handleMouseOver = () => setHovering(true);
  const handleMouseOut = () => setHovering(false);
  const handleTouchStart = () => setHovering(true);
  const handleTouchEnd = () => setHovering(false);

  return {
    hovering,
    handleMouseOver,
    handleMouseOut,
    handleTouchStart,
    handleTouchEnd,
  };
};

export default useHover;