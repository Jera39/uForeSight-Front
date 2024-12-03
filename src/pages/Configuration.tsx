import React, { useState } from 'react';
import { Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const Configuration = () => {
  const [modelType, setModelType] = useState('');
  const [features, setFeatures] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ modelType, features, target });
    // Aquí puedes manejar la configuración, por ejemplo, enviándola a un backend
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Configuración del Modelo
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Modelo</InputLabel>
            <Select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
            >
              <MenuItem value="regression">Regresión</MenuItem>
              <MenuItem value="classification">Clasificación</MenuItem>
              <MenuItem value="clustering">Clustering</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Características (separadas por comas)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Columna Objetivo"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Configurar Modelo
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Configuration;

