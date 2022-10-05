import React, { useContext } from "react";

// Esta función nos devuelve el provider y un consumer
const AppContext = React.createContext();

// App Provider va a ser un wrapper para nuestra App.
// Nuestra aplicación es representada aquí por children.
// Las props podrán ser accedidas en toda nuestra aplicación.
const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{ name: "Daniel", role: "Student" }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook para pasar el contexto a los componentes individualmente
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
