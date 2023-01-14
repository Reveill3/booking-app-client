import { Container } from '@mui/system';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import About from './About';
import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Footer from '../components/Footer';
import { useContext, useEffect } from 'react';
import { BookingContext } from '../context/BookingContext';

const StyledBox = styled(Container)(({ theme }) => ({
  overflow: 'scroll',
  '&::-webkit-scrollbar': { display: 'none' },
  backgroundColor: theme.palette.secondary.dark,
  height: '100vh',
}));

const Home = () => {
  const theme = useTheme();
  const { dispatch } = useContext(BookingContext);
  useEffect(() => {
    document.title = 'Home - Rent A Car';
    dispatch({ type: 'RESET' });
  }, []);
  return (
    <Box sx={{ backgroundColor: theme.palette.secondary.dark }}>
      <Header />
      <StyledBox>
        <Container maxWidth='lg'>
          <About />
        </Container>
      </StyledBox>
    </Box>
  );
};

export default Home;
