import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ComicDetails.css";
import Navbar from "../Navbar/Navbar";
import defaultComicImage from "../../images/comic01.jpg";
import backArrow from "../../images/back.png";
import starIcon from "../../images/star.png";
import heartIcon from "../../images/favorite.png";

const ComicDetails = () => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false); // Estado para saber si es favorito

  // Fetch detalles del cómic
  useEffect(() => {
    const fetchComicDetails = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/comics/${comicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComic(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del cómic:", error);
      }
    };

    fetchComicDetails();
  }, [comicId]);

  if (!comic) return <p>Cargando detalles del cómic...</p>;

  // Validar propiedades opcionales
  const {
    title = comic.data.title || "Título no disponible",
    subtitle = "Subtitle",
    edition = comic.data.edition || "N/A",
    status = comic.data.condition || "Desconocido",
    publisher = comic.data.publisher || "Editorial desconocida",
    price = comic.data.price || "N/A",
    description = comic.data.description || "No hay descripción disponible.",
    creators = [],
    seller = { name: "Desconocido", trades: 0, rating: "N/A" },
  } = comic;

  // Función para manejar el clic en el corazón
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite); // Cambia el estado de favorito
    console.log(
      isFavorite ? "Cómic quitado de favoritos" : "Cómic añadido a favoritos"
    );
  };

  return (
    <div>
      <Navbar alternativeTitle="Detalles del Cómic" />

      <div className="comic-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <div className="back-arrow">
            <img src={backArrow} alt="Volver" />
          </div>
          Volver
        </button>

        <div className="comic-details-header">
          <div className="comic-image">
            <img src={defaultComicImage} alt={title} />
          </div>

          <div className="comic-info">
            <div className="heart-icon-container" onClick={handleFavoriteClick}>
              <img
                src={heartIcon}
                alt="Añadir a favoritos"
                className={`heart-icon ${isFavorite ? "favorited" : ""}`}
              />
            </div>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
            <div className="comic-tags">
              <div className="tag">
                <div className="tag-title">Edición</div>
                <span>{edition}</span>
              </div>
              <div className="tag">
                <div className="tag-title">Estado</div>
                <span>{status}</span>
              </div>
              <div className="tag">
                <div className="tag-title">Editorial</div>
                <span>{publisher}</span>
              </div>
              <div className="tag">
                <div className="tag-title">Precio Ref.</div>
                <span>${price} MXN</span>
              </div>
            </div>
            <p className="comic-description">{description}</p>
            <p className="comic-creators">
              Creadores:{" "}
              {creators.length > 0 ? creators.join(", ") : "No disponibles"}
            </p>

            <div className="seller-info">
              <div className="seller-box">
                <p className="seller-name">Vendedor</p>
                <p>&nbsp;&nbsp;&nbsp;{seller.name}</p>
                <p className="seller-stats">
                  &nbsp;&nbsp;&nbsp;{seller.trades} trueques
                </p>
                <span className="seller-rating">
                  <div className="star-icon">
                    &nbsp;&nbsp;&nbsp;
                    <img src={starIcon} alt="Estrella" />
                    {seller.rating}
                  </div>
                </span>
              </div>
            </div>

            <button className="offer-button">Ofertar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicDetails;
