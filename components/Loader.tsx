
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
       <p className="ml-4 text-slate-300 text-lg">AI is analyzing...</p>
    </div>
  );
};

export default Loader;
