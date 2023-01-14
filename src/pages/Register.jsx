import { useTheme } from '@emotion/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookingContext } from '../context/BookingContext';
import moment from 'moment';

const Register = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { state } = useContext(BookingContext);

  const navigate = useNavigate();
  const handleRegister = async () => {
    if (password !== password2) {
      setError(true);
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(true);
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    try {
      const newUser = await axios.post('/api/auth/local/register', {
        username: email,
        email,
        password,
      });

      try {
        const userData = await axios.post('/api/auth/local', {
          identifier: email,
          password: password,
        });
        localStorage.setItem('token', userData.data.jwt);
        localStorage.setItem(
          'expiresAt',
          moment(Date.now()).add(7, 'days').valueOf()
        );
        navigate('/');
      } catch (error) {
        setError(true);
        setErrorMessage('Error Loggin In');
      }
      !state.new_customer ? navigate('/') : navigate('/checkout');
    } catch (error) {
      setError(true);
      setErrorMessage('Email already exists');
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        mt: '40px',
      }}
    >
      <Typography variant='h3' fontWeight={500} textAlign='center'>
        Create an account
      </Typography>
      <TextField
        id='email'
        label='Email'
        type='email'
        variant='outlined'
        sx={{ marginTop: '30px' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <TextField
        id='password'
        label='Password'
        variant='outlined'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error}
      />
      <TextField
        id='password2'
        label='Confirm Password'
        variant='outlined'
        type='password'
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        error={error}
      />
      {error ? (
        <Typography variant='body1' color='error'>
          {errorMessage}
        </Typography>
      ) : null}
      <Link to='/login' style={{ textDecoration: 'none' }}>
        <Typography variant='body1' color={theme.palette.secondary.dark}>
          Already have an account? Login
        </Typography>
      </Link>
      <Button
        variant='contained'
        sx={{ width: '100px', mb: '40px' }}
        onClick={handleRegister}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register;
