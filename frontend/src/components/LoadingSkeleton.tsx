import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between h-72">
      <div className="h-44 bg-gray-200 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        <div className="h-3 bg-gray-100 rounded-md w-full" />
        <div className="h-3 bg-gray-100 rounded-md w-2/3" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded-md w-16" />
          <div className="h-7 bg-gray-200 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
};

export const BestSellerSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl animate-pulse min-w-[260px] h-72 flex flex-col justify-between flex-shrink-0">
      <div className="h-44 bg-gray-800 w-full" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-700 rounded-md w-3/4" />
        <div className="h-3 bg-gray-800 rounded-md w-full" />
        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 bg-gray-700 rounded-md w-16" />
          <div className="h-7 bg-gray-700 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
};
