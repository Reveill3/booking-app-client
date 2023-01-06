import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Cars from './pages/Cars';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Reservation from './pages/Reservation';
import BookingRoute from './components/BookingRoute';
import CancellationPolicy from './pages/CancellationPolicy';
import Terms from './pages/Terms';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Info from './pages/Info';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Reservations from './pages/Reservations';
import Edit from './pages/Edit';
import { useEffect } from 'react';
import { Stack } from '@mui/material';
import PassConfirm from './pages/PassConfirm';

// Hour 2 Start
const theme = createTheme({
  palette: {
    primary: {
      main: '#37474f',
      light: '#62727b',
      dark: '#1c313a',
    },
    secondary: {
      main: '#e0e0e0',
      light: '#ffffff',
      dark: '#aeaeae',
    },
  },
});

const Layout = () => {
  useEffect(() => {
    if (localStorage.getItem('expiresAt') < Date.now()) {
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('token');
    }
  }, []);
  return (
    <Stack
      sx={{
        height: '100vh',
        justifyContent: 'space-between',
      }}
    >
      <NavBar />
      <Outlet />
      <Footer />
    </Stack>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/cars', element: <Cars /> },
      { path: '/reservation', element: <Reservation /> },
      { path: '/login', element: <Login /> },
      { path: '/auth/confirm', element: <PassConfirm /> },
      { path: '/register', element: <Register /> },
      { path: '/info', element: <Info /> },
      {
        path: '/checkout',
        element: (
          <BookingRoute>
            <Checkout />
          </BookingRoute>
        ),
      },
      { path: '/cancellation', element: <CancellationPolicy /> },
      { path: '/terms', element: <Terms /> },
      { path: '/user/profile', element: <Profile /> },
      { path: '/user/reservations', element: <Reservations /> },
      { path: '/user/reservations/:id', element: <Edit /> },
      { path: '*', element: <h1>404</h1> },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
