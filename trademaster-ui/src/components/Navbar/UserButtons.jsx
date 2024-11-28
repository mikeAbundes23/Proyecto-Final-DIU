import React, { useState, useEffect } from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';

// Importamos el archivo CSS
import './UserButtons.css';

// Importamos los íconos (imágenes png)
import userIcon from '../../images/session.png';
import plusIcon from '../../images/add.png'

const UserButtons = ({ handleLogout }) => {
  // Estados necesarios para controlar los botones en el navbar
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Función para manejar el dropdown del usuario
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (

    <div className='user-buttons'>
      {/* Botón de Publicar comic */}
      <button className="icon-button" >
        <img src={plusIcon} alt="..." className="icon-plus" />
      </button>

      {/* Botón de Usuario */}
      <Dropdown id="dropdown-user" show={showUserDropdown} align="end">
        <Dropdown.Toggle as="div" className="icon-button" onClick={toggleUserDropdown}>
          <img src={userIcon} alt="userconfig" className="icon-user" />
        </Dropdown.Toggle>

        <Dropdown.Menu id='dropdown-user-menu'>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserButtons;