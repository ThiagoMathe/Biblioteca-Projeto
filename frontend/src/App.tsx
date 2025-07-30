import { Route, Routes } from 'react-router-dom';
import LandingPage from './view/LandingPage';
import LivroApp from './view/LivroApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<LivroApp />} />
    </Routes>
  )
}

export default App;