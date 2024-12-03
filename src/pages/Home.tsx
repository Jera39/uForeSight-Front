import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido a la Herramienta de Análisis de Datos
        </Typography>
        <Typography variant="body1">
          Esta herramienta te permite cargar datasets, configurar modelos de análisis y visualizar resultados de manera sencilla e intuitiva.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;

