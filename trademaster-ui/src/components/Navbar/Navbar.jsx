import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importamos el archivo CSS
import "./Navbar.css";

// Importamos la autenticación
import { AuthContext } from "../../context/AuthContext";

// Importamos los íconos (imágenes png)
import logo from "../../images/Logo.png";
import registerIcon from "../../images/register.png";
import loginIcon from "../../images/login.png";
import searchIcon from "../../images/search.png";
import comicsIcon from "../../images/book.png";

// Importamos los modales de Login y Registro
import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";

// Importamos los botones del navbar una vez logueado
import UserButtons from "./UserButtons";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  // Estados para los modales de Login y Signup
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Funciones para manejar el abrir y cerrar de los modales de Login y Signup
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseSignin = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  // Función para cerrar la sesión
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem(
      process.env.REACT_APP_USER_NOTIFICATIONS_OBJECT_NAME
    );
    navigate("/");
    logout();
  };

  return (
    <>
      {!isAuthenticated ? (
        <nav className="navbar-container">
          <div className="navbar-no-auth">
            {/* Logo de la página */}
            <div className="navbar-logo">
              <a href="/">
                <img src={logo} alt="..." className="logo" />
              </a>
            </div>

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

            {/* Botones de Iniciar sesión y Registro */}
            <div className="navbar-buttons">
              <button className="btn" onClick={handleShowSignUp}>
                Registrarse
                <span>
                  <img src={registerIcon} className="button-img" alt="..." />
                </span>
              </button>

              <button className="btn" onClick={handleShowLogin}>
                Iniciar sesión
                <span>
                  <img src={loginIcon} className="button-img" alt="..." />
                </span>
              </button>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navbar-container navbar-auth">
          {/* Encabezado del navbar */}
          <>
            <span className="comics-span">
              <img src={comicsIcon} className="comics-icon" alt="..." />
              Comics Recién Agregados
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
      )}

      {/* Modales de Iniciar sesión y Registro */}
      <SignUpModal
        show={showSignUp}
        handleClose={handleCloseSignin}
        setShowLogin={setShowLogin}
      />
      <LoginModal
        show={showLogin}
        handleClose={handleCloseLogin}
        setShowSignUp={setShowSignUp}
      />
    </>
  );
};

export default Navbar;
