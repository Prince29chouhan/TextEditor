import React from 'react';
import Editor from './components/Editor';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster /> 
      <div className="max-w-4xl w-full">
       
        <Editor />
      </div>
    </div>
  );
};

export default App;
