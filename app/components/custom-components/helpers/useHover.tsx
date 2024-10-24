import { useState } from 'react';

const useHover = () => {
  const [hovering, setHovering] = useState(false);

  const handleMouseOver = () => setHovering(true);
  const handleMouseOut = () => setHovering(false);

  return {
    hovering,
    handleMouseOver,
    handleMouseOut,
  };
};

export default useHover;
