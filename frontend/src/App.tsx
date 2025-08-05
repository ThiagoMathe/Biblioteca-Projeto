import { Route, Routes } from 'react-router-dom';
import LandingPage from './view/LandingPage';
import NotFoundPage from './view/NotFoundPage';
import AuthPage from './view/AuthPage';
import AuthMiddleware from './middleware/AuthMiddleware';
import DashBoardPage from './view/admin/DashBoardPage';
import BookManagementPage from './view/admin/BookManagementPage';
import UserManagementPage from './view/admin/UserManagementPage';
import BorrowHistoryPage from './view/admin/BorrowHistoryPage';

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
        <Route path="/borrow-history" element={<BorrowHistoryPage />} />
      </Route>
    </Routes>
  )
}

export default App;