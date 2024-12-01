import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

// Importamos el archivo CSS
import './WishList.css';

// Importamos la autenticación
import { AuthContext } from '../../context/AuthContext';

// Importamos los íconos (imágenes png)
import favoriteIcon from '../../images/favorite.png';
import searchIcon from '../../images/search.png';
import backIcon from '../../images/back.png';

// Importamos los botones del navbar
import UserButtons from '../Navbar/UserButtons';

// Importamos el componente para los cards de comics
import ComicCard from "../Comics/ComicCard";

const WishList = () => {

    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Función para cerrar la sesión
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem(process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME);
        navigate('/');
        logout();
    };

    // Función para obtener los comics de la wishlist
    const fetchData = async () => {
        try {
            setIsLoading(true);

            const token = localStorage.getItem("access_token");

            if (!token) return;

            // Realizamos la solicitud de la información de los comics
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comics/wishlist/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.data) {
                // Filtramos los items nulos o indefinidos antes de procesar
                const validComics = response.data.data.filter(
                    item => item && item.comic && item.comic.id
                );

                // Eliminamos duplicados usando un Map
                const uniqueComics = Array.from(
                    new Map(validComics.map(item => [item.comic.id, item])).values()
                );

                setComics(uniqueComics);
            } else {
                setComics([]);
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

    // Función para mostrar los cards de comics
    const renderComics = () => {
        if (isLoading) {
            return (
                <div className="no-comics-message">
                    Cargando...
                </div>
            );
        }

        if (!comics || comics.length === 0) {
            return (
                <div className="no-comics-message">
                    No hay cómics en tu lista de deseos
                </div>
            );
        }

        return (

            <div className="comics-grid">
                {comics.map(item => (
                    item && item.comic && (
                        <ComicCard
                            key={item.comic.id}
                            comic={item.comic}
                            initialFavorite={true}
                            onWishListUpdate={async () => {
                                // Agregamos un pequeño delay para dar tiempo a que se complete la operación anterior
                                await new Promise(resolve => setTimeout(resolve, 300));
                                await fetchData();
                            }}
                            isWishListView={true}
                        />
                    )
                ))}
            </div>
        );
    };

    return (

        <>
            <nav className="navbar-container navbar-auth">
                {/* Encabezado del navbar */}
                <>
                    <span className='comics-span'>
                        <img src={favoriteIcon} className='comics-icon' alt="..." />
                        Mi Lista de Deseos
                    </span>
                </>

                {/* Barra de búsqueda */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Busca tu comic preferido..."
                        className="search-input"
                    />
                    <button className="search-button">
                        <img src={searchIcon} alt="..." />
                    </button>
                </div>

                <UserButtons handleLogout={handleLogout} />
            </nav>

            {/* Botón de 'Volver' */}
            <div className="btn btn-back-container">
                <Button className="btn-back" onClick={() => navigate(-1)}>
                    <span>
                        <img src={backIcon} className="btn-back-img" alt="..." />
                    </span>
                    Volver
                </Button>
            </div>

            {/* Lista de comics en la wishlist */}
            <div className="comics-section">
                {renderComics()}
            </div>
        </>
    )
}

export default WishList;