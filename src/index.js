import React from 'react';
import { createRoot } from 'react-dom/client';
import { CrearCuentaForm } from './components/CrearCuentaForm';
import { IniciarSesionForm } from './components/IniciarSesionForm';
import './index.css';

const container = document.getElementById('root');
const page = container?.dataset?.page;

if (page === 'crear-cuenta') {
  const root = createRoot(container);
  root.render(<CrearCuentaForm />);
} else if (page === 'iniciar-sesion') {
  const root = createRoot(container);
  root.render(<IniciarSesionForm />);
}