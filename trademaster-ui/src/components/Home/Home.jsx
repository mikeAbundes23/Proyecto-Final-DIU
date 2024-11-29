import React from 'react';
import { Helmet } from 'react-helmet';

// Importamos el archivo CSS
import './Home.css';

// Importamos los íconos (imágenes png)
import homeImage from '../../images/home.jpeg';
import arrowDown from '../../images/arrow-down.png';

// Importamos el componente del navbar
import Navbar from '../Navbar/Navbar';

const Home = () => {
  
  return (

    <div className="home-container">
      {/* Nombre de la vista */}
      <Helmet>
        <title>TradeMaster - Home</title>
      </Helmet>

      {/* Componente Navbar */}
      <Navbar/>

      <div className='home-image-container'>
        <img src={homeImage} alt="..." />

        <div className='home-image-text'>
            <p className='home-text'>
                BIENVENID@ A TU <br /> PLATAFORMA LIBRE Y <br /> GRATUITA DE TRUEQUE
            </p>
        </div>
        
        <div className='home-image-arrow'>
            <img src={arrowDown} alt="..." />
        </div>
      </div>
    </div>
  );
};

export default Home;