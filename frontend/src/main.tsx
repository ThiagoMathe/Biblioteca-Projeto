import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'
import Header from './components/ui/Header';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento root não encontrado no DOM');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <div className='min-h-[calc(100vh-53px)] flex flex-col'>
        <App />
      </div>
    </BrowserRouter >
  </StrictMode >
);
