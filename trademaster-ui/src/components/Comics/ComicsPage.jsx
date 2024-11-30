import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';

// Importamos el archivo CSS
import './ComicsPage.css';

// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";

// Importamos el componente para los cards de comics
import ComicCard from "./ComicCard";

// Las categorías de comics
const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'Independiente', label: 'Independiente' },
    { value: 'supercomic', label: 'SuperComic' },
    { value: 'eclipse', label: 'Eclipse Entertainment' },
    { value: 'manga', label: 'Manga' }
];

const ComicsPage = () => {

    const [comics, setComics] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // Función para obtener los comics
    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Realizamos la solicitud de la información de los comics
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/`);
            setComics(response.data.data);
        } catch (error) {
            console.error("Error completo en fetchData: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para obtener los comics al cargar la página
    useEffect(() => {
        fetchData();
    }, []);

    // Función para filtrar comics por categoría
    const getFilteredComics = () => {
        if (selectedCategory === 'all') return comics;
        return comics.filter(comic => comic.category === selectedCategory);
    };

    // Función para manejar el cambio de categorías en el select
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Función para mostrar los cards de comics
    const renderComics = () => {
        if (isLoading) {
            return (
                <div className="no-comics-message">
                    Cargando...
                </div>
            );
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
                    />
                ))}
            </div>
        );
    };

  return (

    <div>
        {/* Componente NavBar */}
        <Navbar />

        {/* Contenedor con la parte del grid de comics */}
        <div className="comics-page-container">
            {/* Categorías de comics */}
            <div className='category-select-container'>
                <Form>
                    <Form.Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="category-select"
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form>
            </div>
            
            {/* Cards de los comics */}
            <div className="comics-section">
                {renderComics()}
            </div>
        </div>
    </div>
  );
};

export default ComicsPage;