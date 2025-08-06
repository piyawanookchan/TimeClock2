
import React from 'react';

export const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-6" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
    {...props}
    >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M20.25 14.15v4.075c0 1.313-.964 2.5-2.25 2.5h-12c-1.286 0-2.25-1.187-2.25-2.5V14.15M15.75 18.75h-7.5M15.75 7.5l-1.125-1.5L12 3.75l-2.625 2.25L8.25 7.5M21 7.5h-6.375c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621-.504-1.125-1.125-1.125H9.375c-.621 0-1.125.504-1.125 1.125v3c0 .621-.504 1.125-1.125 1.125H3" 
    />
</svg>
);
