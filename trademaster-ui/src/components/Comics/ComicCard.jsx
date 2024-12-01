import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import './ComicCard.css';

// Importamos el archivo para los mensajes (alert)
import swalMessages from '../../services/SwalMessages';

// Importamos los íconos (imágenes png)
import favoriteIcon from '../../images/favorite.png';
import favoriteRedIcon from '../../images/red-heart.png';
import detailsIcon from '../../images/details.png';
import defaultImage from '../../images/default.jpeg';

const ComicCard = ({ 
    comic, 
    initialFavorite = false, 
    onWishListUpdate, 
    isWishListView = false
}) => {

    // Estado para controlar si el comic se puso como favorito
    const [isFavorite, setIsFavorite] = useState(initialFavorite);

    // Estado para controlar si el botón está en proceso
    const [isLoading, setIsLoading] = useState(false);

    // Función para verificar si el cómic está en la wishlist al cargar
    useEffect(() => {
        const checkWishListStatus = async () => {
            const token = localStorage.getItem("access_token");

            if (!token || isWishListView) return;

            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/comics/wishlist/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    // Verificamos si este cómic está en la wishlist
                    const isInWishList = response.data.data.some(
                        item => item.comic && item.comic.id === (comic?.id || comic?.comic?.id)
                    );
                    setIsFavorite(isInWishList);
                }
            } catch (error) {
                console.error('Error en checkWishListStatus:', error);
            }
        };

        // Solo ejecutamos si tenemos un comic válido
        if (comic && !initialFavorite && !isWishListView) {
            checkWishListStatus();
        }
    }, [comic, initialFavorite, isWishListView]);

    // Función para manejar el click en el ícono de favorito
    const handleFavoriteClick = async () => {
        // Si está cargando, no hacemos nada
        if (isLoading) return;

        const token = localStorage.getItem("access_token");

        // Verificamos si existe el token antes de continuar
        if (!token) {
            swalMessages.errorMessage("Tienes que iniciar sesión para realizar esta acción");
            return;
        }

        const comicId = comic?.id || comic?.comic?.id;
        if (!comicId) {
            console.error('No se pudo obtener el ID del comic');
            return;
        }

        setIsLoading(true); // Iniciamos el estado de carga

        try {
            if (!isFavorite) {
                // Agregamos a la wishlist
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/comics/wishlist/add/${comic.id}/`, 
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.message === "Comic added to wishlist") {
                    setIsFavorite(true);
                    // Mostramos un mensaje de éxito
                    swalMessages.successMessage("¡Comic agregado a tu lista de deseos!");
                    if (onWishListUpdate) onWishListUpdate();
                } else {
                    swalMessages.errorMessage("No se pudo agregar el comic a la lista de deseos<br>Por favor, inténtalo nuevamente");
                }
            } else {
                // Quitamos de la wishlist
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_URL}/api/comics/wishlist/delete/${comic.id}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.message === "Item deleted from wishlist") {
                    setIsFavorite(false);
                    // Mostramos un mensaje de éxito
                    swalMessages.successMessage("¡Comic eliminado de tu lista de deseos!");
                    if (onWishListUpdate) onWishListUpdate();
                } else {
                    swalMessages.errorMessage("No se pudo eliminar el comic de la lista de deseos<br>Por favor, inténtalo nuevamente");
                }
            }
        } catch (error) {
            swalMessages.errorMessage("Hubo un problema con el botón de favoritos");
            console.error('Error en handleFavoriteClick: ', error);
        } finally {
            setIsLoading(false); // Terminamos el estado de carga
        }
    };

    const handleDetailsClick = async () => {
        const token = localStorage.getItem("access_token");

        // Verificamos si existe el token antes de continuar
        if (!token) {
            swalMessages.errorMessage("Tienes que iniciar sesión para realizar esta acción");
            return;
        }
    }

    // Asegurarse de que tengamos datos válidos antes de renderizar
    const comicData = comic?.comic || comic;
    if (!comicData) return null;

    return (

        <div className="comic-info">
            {/* Imagen del comic */}
            <div className="comic-image-container">
                {comicData.image ? (
                    <img 
                        src={`${process.env.REACT_APP_API_URL}/api/comics/${comicData.id}`}
                        alt="..." 
                        className="comic-cover"
                    />
                ) : (
                    <img src={defaultImage} alt="..." className="default-image" />
                )}
            </div>

            {/* Icono de favorito */}
            {!isWishListView && (
                <span 
                    className={`span-favorite ${isLoading ? 'disabled': ''}`}
                    onClick={handleFavoriteClick}
                    style={{ 
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.5 : 1
                    }}
                >
                    <img 
                        src={isFavorite ? favoriteRedIcon : favoriteIcon} 
                        alt="..." 
                        className="favorite-icon"
                    />
                </span>
            )}

            {/* Datos del comic */}
            <div className="comic-data">
                <p className="title-text">{comicData.title}</p>
                <p className="edition-text">Edición: {comicData.edition}</p>
                <p className="price-text">${comicData.price} MXN</p>
            </div>

            <div className="btn-details-div">
                {/* Botón para ver detalles del comic */}
                <Button 
                    className="btn-secondary" 
                    variant="secondary"
                    onClick={handleDetailsClick}
                >
                    Detalles
                    <span>
                        <img src={detailsIcon} className='button-img' alt="..." />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default ComicCard;