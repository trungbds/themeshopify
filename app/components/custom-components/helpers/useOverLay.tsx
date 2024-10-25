import { useState } from 'react';

const useOverlay = () => {
  const [overlayActive, setOverlayActive] = useState(false);

  const handleMouseOver = () => setOverlayActive(true);
  const handleMouseOut = () => setOverlayActive(false);

  return {
    overlayActive,
    handleMouseOver,
    handleMouseOut,
  };
};

export default useOverlay;
