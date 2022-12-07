import { useTheme } from '@emotion/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userData = await axios.post('/api/auth/local', {
        identifier: email,
        password: password,
      });
      localStorage.setItem('token', userData.data.jwt);
      navigate('/');
    } catch (error) {
      setError(true);
      setErrorMessage('Incorrect email or password');
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
      }}
    >
      <TextField
        id='email'
        label='Email'
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
      {error ? (
        <Typography variant='body1' color='error'>
          {errorMessage}
        </Typography>
      ) : null}
      <Link to='/register' style={{ textDecoration: 'none' }}>
        <Typography variant='body1' color={theme.palette.secondary.dark}>
          Create an account
        </Typography>
      </Link>
      <Button
        variant='contained'
        sx={{ width: '100px', marginBottom: '20px' }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
