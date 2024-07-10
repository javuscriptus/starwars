// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterListPage from './pages/CharacterListPage';
import CharacterDetailPage from './pages/CharacterDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CharacterListPage />} />
        <Route path='/page/:page' element={<CharacterListPage />} />
        <Route path='/character/:id' element={<CharacterDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
