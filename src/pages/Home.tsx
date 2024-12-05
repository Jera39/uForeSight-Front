import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Dataset {
  columns: string[];
  data: Row[];
}
interface Row {
  [key: string]: any; // Define que cada clave es un string y el valor puede ser de cualquier tipo
}
const Home = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    // Llamada al backend para obtener el dataset cargado
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/home-dataset');
        if (response.ok) {
          const data = await response.json();
          setDataset({
            columns: data.columns,
            data: data.data,
          });
        } else {
          // Si no hay dataset cargado
          setDataset(null);
        }
      } catch (error) {
        console.error('Error fetching dataset:', error);
        setDataset(null);
      }
    };

    fetchData();
  }, []);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!dataset) {
    return (
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido a tu Plataforma de Análisis de Datos
          </Typography>
          <Typography variant="body1" paragraph>
            Esta herramienta te permite cargar tus datasets, configurar modelos de análisis y visualizar resultados de manera sencilla e intuitiva.
          </Typography>
          <Typography variant="body1" paragraph>
            Para comenzar, sigue estos pasos:
          </Typography>
          <ol>
            <li>
              <Typography variant="body1">
                Haz clic en el botón "Cargar Datos" en la barra de navegación o usa el botón de abajo.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Selecciona tu archivo CSV o Excel con los datos que deseas analizar.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Una vez cargado, volverás a esta página donde podrás ver una vista previa de tu dataset.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Después, podrás configurar tu modelo y ver los resultados del análisis.
              </Typography>
            </li>
          </ol>
          <Button
            component={Link}
            to="/upload"
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            Cargar Dataset
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Dataset Cargado
        </Typography>
        <TableContainer>
          <Table stickyHeader aria-label="dataset table">
            <TableHead>
              <TableRow>
                {dataset.columns.map((column, index) => (
                  <TableCell key={index}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataset.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {dataset.columns.map((column, cellIndex) => (
                      <TableCell key={cellIndex}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={dataset.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default Home;
