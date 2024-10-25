import { useEffect } from 'react';

const useDisableScroll = (isModalOpen: boolean): void => {
  useEffect(() => {
    if (isModalOpen) {
      // Ngăn body cuộn khi modal mở
      document.body.style.overflow = 'hidden';
    } else {
      // Khôi phục trạng thái cuộn khi modal đóng
      document.body.style.overflow = '';
    }

    // Cleanup khi component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);
};

export default useDisableScroll;
