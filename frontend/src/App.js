import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from './AppLayout';
import Profile from './Pages/Profile';
import Login from './Pages/Authentication/Login';
import Signup from './Pages/Authentication/Signup';

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


      </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
