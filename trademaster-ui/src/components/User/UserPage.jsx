import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

// Importamos el archivo CSS
import "./UserPage.css";
// Importamos el componente del navbar
import Navbar from "../Navbar/Navbar";

const UserPage = () => {

  return (

    // Página Principal del Usuario
    <div>
      {/* Componente NavBar */}
      <Navbar />
    </div>
  );
};

export default UserPage;