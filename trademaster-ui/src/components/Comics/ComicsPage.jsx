import React, { useState, useEffect } from "react";
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/comics/`
      );
      setComics(response.data.data);
    } catch (error) {
      console.error("Error completo en fetchData: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <ComicCard key={comic.id} comic={comic} />
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
