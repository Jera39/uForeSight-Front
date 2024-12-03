import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button, Chip, Box } from '@mui/material';

interface Feature {
  name: string;
  selected: boolean;
}

const Configuration = () => {
  const [modelType, setModelType] = useState('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    // Aquí harías la llamada al backend para obtener las características
    // Por ahora, usaremos datos de ejemplo
    const fetchFeatures = async () => {
      // Simula una llamada al backend
      const response = await fetch('/api/features');
      const data = await response.json();
      setFeatures(data.map((feature: string) => ({ name: feature, selected: false })));
    };

    fetchFeatures();
  }, []);

  const handleFeatureClick = (clickedFeature: string) => {
    setFeatures(features.map(feature => 
      feature.name === clickedFeature 
        ? { ...feature, selected: !feature.selected }
        : feature
    ));
  };

  const handleTargetClick = (clickedTarget: string) => {
    setTarget(target === clickedTarget ? null : clickedTarget);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFeatures = features.filter(f => f.selected).map(f => f.name);
    console.log({ modelType, selectedFeatures, target });
    // Aquí enviarías la configuración al backend
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
              onChange={(e) => setModelType(e.target.value as string)}
            >
              <MenuItem value="regression">Regresión</MenuItem>
              <MenuItem value="classification">Clasificación</MenuItem>
              <MenuItem value="clustering">Clustering</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
            Selecciona las Características
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
            {features.map((feature) => (
              <Chip
                key={feature.name}
                label={feature.name}
                onClick={() => handleFeatureClick(feature.name)}
                color={feature.selected ? "primary" : "default"}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Selecciona la Columna Objetivo
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
            {features.map((feature) => (
              <Chip
                key={feature.name}
                label={feature.name}
                onClick={() => handleTargetClick(feature.name)}
                color={target === feature.name ? "secondary" : "default"}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
            Configurar Modelo
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Configuration;

