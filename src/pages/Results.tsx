import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Métrica 1', valor: 4000 },
  { name: 'Métrica 2', valor: 3000 },
  { name: 'Métrica 3', valor: 2000 },
  { name: 'Métrica 4', valor: 2780 },
  { name: 'Métrica 5', valor: 1890 },
];

const Results = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Resultados del Análisis
        </Typography>
        <Typography variant="body1" paragraph>
          Aquí se mostrarían las métricas de evaluación del modelo y los gráficos correspondientes.
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valor" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default Results;

