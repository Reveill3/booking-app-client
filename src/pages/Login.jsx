import { useTheme } from '@emotion/react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import joi from 'joi';
import CircularProgress from '@mui/material/CircularProgress';

const schema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  password: joi.string().min(6).required(),
});

const forgotSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
});

const logsnag = new window.LogSnag({
  token: process.env.REACT_APP_LOGSNAG_KEY,
  project: 'rev-rentals',
});

const Login = () => {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      const userData = await axios.post('/api/auth/local', {
        identifier: email,
        password: password,
      });
      console.log(userData);
      localStorage.setItem('token', userData.data.jwt);
      localStorage.setItem(
        'expiresAt',
        moment(Date.now()).add(7, 'days').valueOf()
      );
      navigate('/');
    } catch (error) {
      setError(true);
      setErrorMessage('Incorrect email or password');
    }
  };

  const handleReset = async () => {
    const validate = (data) => {
      const { error } = forgotSchema.validate(data);
      if (error) {
        const errors = {};
        error.details.forEach((item) => {
          errors[item.path[0]] = item.message;
        });
        return errors;
      }
      return null;
    };

    const errors = validate({ email });

    if (errors) {
      setErrors(errors);
      setErrorMessage('Please enter a valid email');
      return;
    }

    setLoading(true);

    const resetResponse = await axios.post('/api/auth/forgot-password', {
      email: email,
    });

    await logsnag.publish({
      channel: 'auth',
      event: 'forgot-password',
      description: `User ${email} has requested a password reset.`,
    });
    setReset(true);
    setLoading(false);
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
      {reset ? (
        <Alert severity='info'>
          An email has been sent to your email address. Use the link inside to
          reset your password.
        </Alert>
      ) : null}
      {location.state?.error ? (
        <Alert severity='warning'>
          Code expried. Hit forgot password again and get a new one sent to your
          email.
        </Alert>
      ) : null}
      {location.state?.success ? (
        <Alert severity='success'>Password Reset Successfully. Login.</Alert>
      ) : null}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            id='email'
            label='Email'
            variant='outlined'
            sx={{ marginTop: '30px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error || errors?.email !== undefined}
          />
          <TextField
            id='password'
            label='Password'
            variant='outlined'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error || errors?.password !== undefined}
          />
          {error || errors ? (
            <Typography variant='body1' color='error'>
              {errorMessage}
            </Typography>
          ) : null}
          <Link to='/register' style={{ textDecoration: 'none' }}>
            <Typography variant='body1' color={theme.palette.secondary.dark}>
              Create an account
            </Typography>
          </Link>
          <Link onClick={handleReset} style={{ textDecoration: 'none' }}>
            <Typography variant='body1' color={theme.palette.secondary.dark}>
              Forgot password?
            </Typography>
          </Link>
          <Button
            variant='contained'
            sx={{ width: '100px', marginBottom: '20px' }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </>
      )}
    </Box>
  );
};

export default Login;
