import { Route, Routes } from 'react-router-dom';
import LandingPage from './view/LandingPage';
import NotFoundPage from './view/NotFoundPage';
import AuthPage from './view/AuthPage';
import AuthMiddleware from './middleware/AuthMiddleware';
import DashBoardPage from './view/admin/DashBoardPage';
import BookManagementPage from './view/admin/BookManagementPage';
import UserManagementPage from './view/admin/UserManagementPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route element={<AuthMiddleware />}>
        <Route path="/dashboard" element={<DashBoardPage />} />
        <Route path="/book-management" element={<BookManagementPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
      </Route>
    </Routes>
  )
}

export default App;