import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

// Esta función nos devuelve el provider y un consumer (aunque aquí sólo usamos el provider)
const AppContext = React.createContext();

const allMealsUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

const getFavoritesFromLocalStorage = () => {
  let favorites = localStorage.getItem("favorites");
  if (favorites) {
    favorites = JSON.parse(localStorage.getItem("favorites"));
  } else {
    favorites = [];
  }
  return favorites;
};

// App Provider va a ser un wrapper para nuestra App (ver index.js)
// Nuestra aplicación es representada aquí por children (es una keyword especial de react que representa cualquier cosa que contenga el componente).
// Las props podrán ser accedidas en toda nuestra aplicación.
// Desde este componente tendremos que retornar AppContext.Provider
const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

  // Función para recoger datos
  // Declaramos una función asíncrona porque no puede ser la de useEffect (no puede ser asíncrona)
  const fetchMeals = async (url) => {
    setLoading(true);
    try {
      // Destructuring del la propiedad data del objeto con muchas otras propiedades que devuelve axios
      const { data } = await axios(url);
      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const fetchRandomMeal = () => {
    // Reutilizamos la función anterior
    fetchMeals(randomMealUrl);
  };

  const selectMeal = (idMeal, favoriteMeal) => {
    let meal;
    if (favoriteMeal) {
      meal = favorites.find((meal) => meal.idMeal === idMeal);
    } else {
      meal = meals.find((meal) => meal.idMeal === idMeal);
    }
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const closeModal = () => {
    console.log("hey");
    setShowModal(false);
  };

  const addToFavorites = (idMeal) => {
    const alreadyFavorite = favorites.find((meal) => meal.idMeal === idMeal);
    if (alreadyFavorite) return;

    const meal = meals.find((meal) => meal.idMeal === idMeal);
    const updatedFavorites = [...favorites, meal];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (idMeal) => {
    // Filtramos el array de favoritos. Si el id de la comida no coincide con el id de la comida clicada, no se retornará.
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  /* EFFECTS */

  // Cuando la aplicación se carga, llamamos a fetchMeals.
  useEffect(() => {
    // Por defecto, la API devuelve algunas recetas aunque no haya searchTerm especificado.
    fetchMeals(allMealsUrl);
  }, []);

  useEffect(() => {
    // Prevents a bug (2)
    // Si no hay searchTerm no se llama a fetchMeals (simplemente return), esto ocurre cuando se limpia el estado de searchTerm al clicar el botón Inspire Me
    if (!searchTerm) return;
    fetchMeals(allMealsUrl + searchTerm);
  }, [searchTerm]);

  // Doble {{}} porque estamos pasando 1º una expresión jsx 2º un dato tipo objeto.
  return (
    <AppContext.Provider
      value={{
        loading,
        meals,
        setSearchTerm,
        fetchRandomMeal,
        showModal,
        selectMeal,
        selectedMeal,
        closeModal,
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook para pasar el contexto a los componentes individualmente (no es necesario, pero ver Meals component)
const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
