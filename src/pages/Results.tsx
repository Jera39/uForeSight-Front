import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, TextField, Grid } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FaCrown } from 'react-icons/fa'; // Importa un ícono de coronita
import axios from 'axios';

const Results = () => {
  const [metrics, setMetrics] = useState([
    { name: 'Accuracy 1', value: 0.85, color: '#8884d8' },
    { name: 'Accuracy 2', value: 0.90, color: '#82ca9d' },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<string | null>(null);
  const [predictionInput, setPredictionInput] = useState<Record<string, string>>({});
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [requiredColumns, setRequiredColumns] = useState<string[]>([]);
  const [uniqueValues, setUniqueValues] = useState<Record<string, string[]>>({});
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];
  const maxValue = Math.max(...metrics.map(metric => metric.value)); // Encuentra el valor máximo



  const fetchModelStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/results');
      setModelStatus(response.data.message);
      if (response.data.accuracy) {
        setMetrics([
          {
            name: 'Accuracy',
            value: response.data.accuracy,
            color: colors[0], // Selecciona un color del arreglo `colors`
          },
        ]);
        
      }
    } catch (error) {
      console.error('Error al obtener el estado del modelo:', error);
    }
  };

  const fetchRequiredColumns = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/select-columns');
      setRequiredColumns(response.data.features);
  
      // Obtener valores únicos para columnas categóricas
      const uniqueValuesTemp: Record<string, string[]> = {};
      for (const column of response.data.categorical || []) {
        const uniqueResponse = await axios.get('http://127.0.0.1:5000/unique-values', {
          params: { column }
        });
        uniqueValuesTemp[column] = uniqueResponse.data.unique_values;
      }
      setUniqueValues(uniqueValuesTemp);
    } catch (error) {
      console.error('Error al obtener las columnas requeridas:', error);
    }
  };
  

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/metrics');
        setMetrics(response.data.metrics);
      } catch (error) {
        console.error('Error al cargar las métricas:', error);
      }
    };
  
    fetchModelStatus();
    fetchRequiredColumns();
    fetchMetrics();
  }, []);
  

  const handleTrainModel = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/train-model');
      if (response.data.accuracy) {
        const timestamp = new Date().toLocaleString();
        const newMetric = {
          name: `Modelo ${metrics.length + 1}`, // Nombre único
          value: response.data.accuracy, // Accuracy del modelo
          features: requiredColumns, // Columnas utilizadas
          target: response.data.target || 'N/A', // Obtiene el objetivo del backend
          timestamp: timestamp, // Marca de tiempo
          color: colors[metrics.length % colors.length], // Asigna un color único
        };
        setMetrics(prevMetrics => [...prevMetrics, newMetric]);
  
        // Enviar métrica completa al backend (opcional)
        await axios.post('http://127.0.0.1:5000/metrics', { metric: newMetric });
      }
      setModelStatus('Modelo entrenado exitosamente');
    } catch (error) {
      console.error('Error al entrenar el modelo:', error);
      setModelStatus('Error al entrenar el modelo');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  const handlePredict = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/predict', predictionInput);
      setPredictionResult(response.data.prediction);
    } catch (error) {
      console.error('Error al realizar la predicción:', error);
      setPredictionResult('Error al realizar la predicción');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (column: string, value: string) => {
    setPredictionInput(prev => ({ ...prev, [column]: value }));
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Resultados del Análisis
        </Typography>
        <Typography variant="body1" paragraph>
          {modelStatus || '¿Listo para entrenar el nuevo modelo?'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTrainModel}
          disabled={loading}
          style={{ marginRight: '1rem', marginBottom: '1rem' }}
        >
          Entrenar Modelo
        </Button>
        
        {metrics.length > 0 && (
          <ResponsiveContainer width="100%" height={300} style={{ marginBottom: '2rem' }}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { value, features, target, timestamp } = payload[0].payload;
                    return (
                      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                        <p><strong>{payload[0].name}</strong></p>
                        <p>Accuracy: {value}</p>
                        <p>Características: {features?.join(', ') || 'N/A'}</p>
                        <p>Objetivo: {target || 'N/A'}</p>
                        <p>Fecha: {timestamp || 'N/A'}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="value" name="Precisión de los Modelos">
                {metrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value === maxValue ? 'gold' : entry.color} />
                ))}
              </Bar>

              {/* Coronita para la mejor barra */}
              {metrics.map((entry, index) => {
                if (entry.value === maxValue) {
                  return (
                    <text
                      key={`crown-${index}`}
                      x={(index + 0.4) * (800 / metrics.length)} // Ajusta dinámicamente en base al ancho del gráfico
                      y={(1 - entry.value) * 250 - 20} // Ajusta dinámicamente según la altura de la barra
                      fill="gold"
                      textAnchor="middle"
                      fontSize="40"
                    >
                      👑
                    </text>
                  );
                }
                return null;
              })}


            </BarChart>

          </ResponsiveContainer>
        
        
        )}

        <Typography variant="h6" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          Predicción
        </Typography>
        <Grid container spacing={2}>
          {requiredColumns.map(column => (
            <Grid item xs={12} sm={6} key={column}>
              {uniqueValues[column] ? (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{column}</InputLabel>
                  <Select
                    value={predictionInput[column] || ''}
                    onChange={(e) => handleInputChange(column, e.target.value)}
                  >
                    {uniqueValues[column].map(value => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  label={column}
                  fullWidth
                  margin="normal"
                  onChange={(e) => handleInputChange(column, e.target.value)}
                />
              )}
            </Grid>
          ))}

        </Grid>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePredict}
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          Realizar Predicción
        </Button>
        {predictionResult && (
          <Typography variant="body1" style={{ marginTop: '1rem' }}>
            Resultado de la Predicción: {predictionResult}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Results;

