import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import axios from 'axios';

const DataUpload = () => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Función para obtener el archivo cargado desde el backend
  const fetchUploadedFile = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/dataset');
      if (response.data.dataset_name) {
        setUploadedFileName(response.data.dataset_name); // Establecer el archivo cargado
      }
    } catch (error) {
      console.error('Error al obtener el dataset:', error);
      setUploadedFileName(null); // Resetear si hay error
    }
  }, []);

  useEffect(() => {
    fetchUploadedFile(); // Consultar el backend al montar la página
  }, [fetchUploadedFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log('Archivo subido exitosamente:', response.data);
          setUploadedFileName(file.name); // Actualizar el archivo cargado
          alert(`Archivo ${file.name} subido exitosamente`);
        })
        .catch((error) => {
          console.error('Error al subir el archivo:', error);
          alert('Error al subir el archivo');
        });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
  });

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Carga de Datos
        </Typography>
        {uploadedFileName ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Archivo cargado: <strong>{uploadedFileName}</strong>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setUploadedFileName(null)} // Reiniciar el estado para cargar otro archivo
              style={{ marginTop: '1rem' }}
            >
              Cargar otro archivo
            </Button>
          </Box>
        ) : (
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #cccccc',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Suelta los archivos aquí ...</p>
            ) : (
              <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</p>
            )}
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default DataUpload;
