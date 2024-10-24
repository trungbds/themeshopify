import { useState } from 'react';

const useOverLay = () => {
  const [hovering, setHovering] = useState(false);

  const handleMouseOver = () => setHovering(true);
  const handleMouseOut = () => setHovering(false);

  return {
    hovering,
    handleMouseOver,
    handleMouseOut,
  };
};

export default useOverLay;
