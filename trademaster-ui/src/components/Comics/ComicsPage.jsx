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

    // Función para obtener la wishlist
    const fetchWishList = async (token) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/comics/wishlist/`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            // Validamos que response.data.data exista y sea un array
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                return new Set(response.data.data.map(item => item.comic?.id).filter(Boolean));
            }
            return new Set(); // Regresamos un Set vacío si no hay datos válidos
        } catch (error) {
            console.error("Error en fetchWishList:", error);
            return new Set();
        }
    };

    // Función para obtener datos
    const fetchData = async () => {
        setIsLoading(true);

        try {
            // Primero obtenemos los comics
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/`);
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
                const comicsWithFavoriteStatus = comicsData.map(comic => ({
                    ...comic,
                    initialFavorite: wishListData.has(comic.id)
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
                        initialFavorite={comic.initialFavorite}
                        onWishListUpdate={fetchData}
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