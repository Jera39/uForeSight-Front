import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Análisis de Datos
        </Typography>
        <Button color="inherit" component={Link} to="/">Inicio</Button>
        <Button color="inherit" component={Link} to="/upload">Cargar Datos</Button>
        <Button color="inherit" component={Link} to="/configure">Configurar</Button>
        <Button color="inherit" component={Link} to="/results">Resultados</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

