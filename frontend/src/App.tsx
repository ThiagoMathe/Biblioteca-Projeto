import { Route, Routes } from 'react-router-dom';
import LandingPage from './view/LandingPage';
import LivroApp from './view/LivroApp';
import NotFoundPage from './view/NotFoundPage';
import AuthPage from './view/AuthPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<LivroApp />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;