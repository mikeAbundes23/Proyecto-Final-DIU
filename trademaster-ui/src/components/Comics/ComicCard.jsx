import React from "react";

// Importamos el archivo CSS
import './ComicCard.css';

// Importamos los íconos (imágenes png)
import favoriteIcon from '../../images/favorite.png';
import detailsIcon from '../../images/details.png';
import defaultImage from '../../images/default.jpeg';
import { Button } from "react-bootstrap";

const ComicCard = ({ comic }) => {

    // console.log('Comic data:', comic);

    return (

        <div className="comic-info">
            {/* Imagen del comic */}
            <div className="comic-image-container">
                {comic.image ? (
                    <img 
                        src={`${process.env.REACT_APP_API_URL}/api/comics/`}
                        alt="..." 
                        className="comic-cover"
                    />
                ) : (
                    <img src={defaultImage} alt="..." className="default-image" />
                )}
            </div>

            {/* Icono de favorito */}
            <span className="span-favorite">
                <img src={favoriteIcon} alt="..." className="favorite-icon" />
            </span>

            {/* Datos del comic */}
            <div className="comic-data">
                <p className="title-text">{comic.title}</p>
                <p className="edition-text">Edición: {comic.edition}</p>
                <p className="price-text">${comic.price} MXN</p>
            </div>

            <div className="btn-details-div">
                {/* Botón para ver detalles del comic */}
                <Button className="btn-secondary" variant="secondary">
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