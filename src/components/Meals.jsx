// import { useContext } from "react";
// import { AppContext } from "../context";
import { useGlobalContext } from "../context";

const Meals = () => {
  // Le pasamos el contexto a nuestro componente
  const context = useGlobalContext();
  // Con los imports comentados al inicio también podríamos hacer: (pero con un custom hook nos ahorramos un import)
  //   const context = useContext(AppContext);
  console.log(context);
  return <h1>Meals Component</h1>;
};

export default Meals;
