import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Typography, Paper } from '@mui/material';
import * as XLSX from 'xlsx';

const DataUpload = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          console.log(worksheet);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/csv': ['.csv'],
  }
  });

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Carga de Datos
        </Typography>
        <div {...getRootProps()} style={{
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Suelta los archivos aquí ...</p> :
              <p>Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos</p>
          }
        </div>
      </Paper>
    </Container>
  );
};

export default DataUpload;

