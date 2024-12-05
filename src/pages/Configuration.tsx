import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button, Chip, Box } from '@mui/material';
import axios from 'axios';

interface Feature {
  name: string;
  selected: boolean;
}

const Configuration = () => {
  const [modelType, setModelType] = useState('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [categoricalFeatures, setCategoricalFeatures] = useState<string[]>([]);
  const [isConfigured, setIsConfigured] = useState<boolean>(
    () => localStorage.getItem('isConfigured') === 'true' // Cargar el estado de LocalStorage
  );

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        // Cargar las columnas del dataset
        const datasetResponse = await axios.get('http://127.0.0.1:5000/dataset');
        const columns = datasetResponse.data.columns || [];
  
        if (columns.length === 0) {
          throw new Error('No se encontraron columnas en el dataset cargado.');
        }
  
        // Cargar configuración previa
        const configResponse = await axios.get('http://127.0.0.1:5000/select-columns');
        const selectedFeatures = configResponse.data.features || [];
        const selectedTarget = configResponse.data.target || null;
        const selectedCategorical = configResponse.data.categorical || [];
  
        // Configurar las características
        setFeatures(
          columns.map((column: string) => ({
            name: column,
            selected: selectedFeatures.includes(column),
          }))
        );
  
        // Configurar la columna objetivo
        setTarget(selectedTarget);
  
        // Configurar las columnas categóricas
        setCategoricalFeatures(selectedCategorical);
      } catch (error) {
        console.error('Error al cargar la configuración:', error);
        alert(
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al cargar la configuración.'
        );
      }
    };
  
    fetchFeatures();
  }, []);  

  const handleFeatureClick = (clickedFeature: string) => {
    setFeatures(features.map((feature) =>
      feature.name === clickedFeature
        ? { ...feature, selected: !feature.selected }
        : feature
    ));
  };

  const handleTargetClick = (clickedTarget: string) => {
    setTarget(target === clickedTarget ? null : clickedTarget);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFeatures = features.filter((f) => f.selected).map((f) => f.name);
  
    if (!target || selectedFeatures.length === 0) {
      alert('Debes seleccionar al menos una característica, una columna objetivo y las columnas categóricas.');
      return;
    }
  
    const payload = {
      features: selectedFeatures,
      target,
      categorical: categoricalFeatures,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/select-columns', payload);
      console.log('Configuración enviada:', response.data);
      setIsConfigured(true); // Cambiar el estado a configurado
      localStorage.setItem('isConfigured', 'true'); // Guardar el estado en LocalStorage
      alert('Configuración enviada exitosamente');
    } catch (error) {
      console.error('Error al enviar la configuración:', error);
      alert('Error al enviar la configuración');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/reset-columns');
      console.log('Estado reiniciado:', response.data);
      setIsConfigured(false); // Volver a habilitar el botón de configurar
      localStorage.setItem('isConfigured', 'false'); // Guardar el estado en LocalStorage
      alert('Estado reiniciado exitosamente');
    } catch (error) {
      console.error('Error al reiniciar el estado:', error);
      alert('Error al reiniciar el estado');
    }
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
              disabled={isConfigured} // Deshabilitar si ya está configurado
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
                disabled={isConfigured} // Deshabilitar si ya está configurado
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
                disabled={isConfigured} // Deshabilitar si ya está configurado
              />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            Selecciona las Columnas Categóricas
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
            {features.map((feature) => (
              <Chip
                key={feature.name}
                label={feature.name}
                onClick={() => {
                  setCategoricalFeatures((prev) =>
                    prev.includes(feature.name)
                      ? prev.filter((f) => f !== feature.name)
                      : [...prev, feature.name]
                  );
                }}
                color={categoricalFeatures.includes(feature.name) ? "secondary" : "default"}
                style={{ cursor: "pointer" }}
                disabled={isConfigured} // Deshabilitar si ya está configurado
              />
            ))}
          </Box>

          {isConfigured ? (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: '1rem' }}
              onClick={handleReset}
            >
              Editar
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem' }}
            >
              Configurar Modelo
            </Button>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default Configuration;
