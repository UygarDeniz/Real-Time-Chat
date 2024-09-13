import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Home from './pages/Home';
function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<ProtectedRoute />}>
        <Route path='' element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
