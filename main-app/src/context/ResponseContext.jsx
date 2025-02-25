import React, { createContext, useState, useContext } from 'react';

const ResponseContext = createContext();

export const ResponseProvider = ({ children }) => {
  const [responses, setResponses] = useState(null);

  const updateResponses = (newResponses) => {
    setResponses(newResponses);
  };

  return (
    <ResponseContext.Provider value={{ responses, updateResponses }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponses = () => {
  const context = useContext(ResponseContext);
  if (!context) {
    throw new Error('useResponses must be used within a ResponseProvider');
  }
  return context;
};
