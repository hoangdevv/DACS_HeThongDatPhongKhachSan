import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

// Hàm cho icon Facebook
export const FacebookIcon = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="facebookIcon">
    <FaFacebook />
  </a>
);

// Hàm cho icon Zalo
export const ZaloIcon = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="zaloIcon">
    <SiZalo />
  </a>
);

// Hàm cho icon giỏ hàng
export const CartIcon = ({ onClick }) => (
  <button className="cartIcon" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-shopping-cart"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h8.24a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  </button>
);
