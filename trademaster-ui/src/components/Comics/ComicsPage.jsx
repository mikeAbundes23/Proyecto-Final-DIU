import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import axios from "axios";
import "./ComicsPage.css";
import Navbar from "../Navbar/Navbar";
import ComicCard from "./ComicCard";

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "Independiente", label: "Independiente" },
  { value: "supercomic", label: "SuperComic" },
  { value: "eclipse", label: "Eclipse Entertainment" },
  { value: "manga", label: "Manga" },
];

const ComicsPage = () => {
  const [comics, setComics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const searchTerm = useSelector((state) => state.search.searchTerm);

  // Función para obtener la wishlist
  const fetchWishList = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comics/wishlist/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Validamos que response.data.data exista y sea un array
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return new Set(
          response.data.data.map((item) => item.comic?.id).filter(Boolean)
        );
      }
      return new Set(); // Regresamos un Set vacío si no hay datos válidos
    } catch (error) {
      console.error("Error en fetchWishList:", error);
      return new Set();
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Primero obtenemos los comics
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comics/`
      );
      let comicsData = [];

      if (response.data && Array.isArray(response.data.data)) {
        comicsData = response.data.data;
      }

      // Verificamos si hay un token
      const token = localStorage.getItem("access_token");

      if (token) {
        // Si hay token, obtenemos la wishlist
        const wishListData = await fetchWishList(token);

        // Agregamos el estado de favorito a cada cómic
        const comicsWithFavoriteStatus = comicsData.map((comic) => ({
          ...comic,
          initialFavorite: wishListData.has(comic.id),
        }));
        setComics(comicsWithFavoriteStatus);
      } else {
        // Si no hay token, simplemente mostramos los comics sin estado de favorito
        setComics(comicsData);
      }
    } catch (error) {
      console.error("Error completo en fetchData: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencias vacías para que no se redefina

  useEffect(() => {
    fetchData(); // Llamada inicial
  }, [fetchData]);

  const getFilteredComics = () => {
    let filteredComics = comics;

    if (selectedCategory !== "all") {
      filteredComics = filteredComics.filter(
        (comic) => comic.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredComics = filteredComics.filter((comic) =>
        comic.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredComics;
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const renderComics = () => {
    if (isLoading) {
      return <div className="no-comics-message">Cargando...</div>;
    }

    const filteredComics = getFilteredComics();

    if (filteredComics.length === 0) {
      return (
        <div className="no-comics-message">
          No hay cómics disponibles en esta categoría
        </div>
      );
    }

    return (
      <div className="comics-grid">
        {filteredComics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            initialFavorite={comic.initialFavorite}
            onWishListUpdate={fetchData}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="comics-page-container">
        <div className="category-select-container">
          <Form>
            <Form.Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
          </Form>
        </div>
        <div className="comics-section">{renderComics()}</div>
      </div>
    </div>
  );
};

export default ComicsPage;
