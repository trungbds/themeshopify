import { useEffect, useState } from 'react';

const useHeaderOverlay = (): [boolean, () => void, () => void] => {
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  const openOverlay = () => setOverlayOpen(true);
  const closeOverlay = () => setOverlayOpen(false);

  useEffect(() => {
    const header = document.querySelector('.header-overlay');
    if (header) {
      if (isOverlayOpen) {
        header.classList.add('actived');
      } else {
        header.classList.remove('actived');
      }
    }

    // Cleanup khi unmount
    return () => {
      if (header) {
        header.classList.remove('actived');
      }
    };
  }, [isOverlayOpen]);

  return [isOverlayOpen, openOverlay, closeOverlay];
};

export default useHeaderOverlay;
