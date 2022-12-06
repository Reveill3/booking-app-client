import { Container } from '@mui/system';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import About from './About';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Footer from '../components/Footer';

const Home = () => {
  const theme = useTheme();
  return (
    <Box>
      <Header />
      <Box
        sx={{ backgroundColor: theme.palette.secondary.dark, height: '100vh' }}
      >
        <Container>
          <About />
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
