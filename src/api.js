import axios from 'axios';

// Configurar la URL base para tus llamadas
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000', // La URL de tu backend
});

// Subir el archivo (endpoint /upload)
export const uploadDataset = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// Seleccionar columnas (endpoint /select-columns)
export const selectColumns = (features, target, categorical) => {
    return api.post('/select-columns', {
        features,
        target,
        categorical,
    });
};

// Entrenar el modelo (endpoint /train-model)
export const trainModel = () => {
    return api.post('/train-model');
};

// Hacer una predicción (endpoint /predict)
export const predict = (data) => {
    return api.post('/predict', data);
};

// Reiniciar columnas (endpoint /reset-columns)
export const resetColumns = () => {
    return api.post('/reset-columns');
};

export default api;
