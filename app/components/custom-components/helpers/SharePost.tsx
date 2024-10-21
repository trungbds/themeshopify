import React from 'react';
import {useLocation } from '@remix-run/react';
import iconsocialfacebook from '~/assets/fonts/icons/icon-social-facebook.svg';
import iconsocialx from '~/assets/fonts/icons/icon-social-x.svg';
import iconsociallinkedln from '~/assets/fonts/icons/icon-social-linkedln.svg';


export default function SharePost({ title }) {
  const location = useLocation();

  // Kiểm tra nếu đang chạy trên client-side trước khi sử dụng `window`
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${location.pathname}` 
    : ''; // Nếu chạy trên server, giá trị currentUrl sẽ là một chuỗi trống

  // Các URL chia sẻ lên mạng xã hội
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`;

  return (
    <div className='share-post'>
      
      <h4 className='title'>Share</h4>
      <div className='social-list'>
       
          <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
            <img src={iconsocialfacebook}  />
          </a>
  
    
          <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
            <img src={iconsocialx}  />
          </a>
  
  
          <a href={linkedInShareUrl} target="_blank" rel="noopener noreferrer">
            <img src={iconsociallinkedln}  />
          </a>
    
      </div>
    </div>
  );
}
