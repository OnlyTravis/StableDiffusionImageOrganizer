import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import SettingsPage from './pages/settingsPage';
import FoldersPage from './pages/foldersPage';
import FolderPage from './pages/folderPage';

export default function RoutesComponent() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/folders" element={<FoldersPage />} />
          <Route path="/folder/*" element={<FolderPage />} />
        </Routes>
      </BrowserRouter>
    );
}