import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import joi from 'joi';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const schema = joi.object({
  password: joi.string().min(8).required(),
  code: joi.string().required(),
  passwordConfirmation: joi.string().required(),
});

const PassConfirm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const code = location.search.split('=')[1];

  const handleChange = async () => {
    if (password !== confirmPassword) {
      setError(true);
      setErrorMessage('Passwords do not match');
      return;
    }

    const { error } = schema.validate({
      password,
      code,
      passwordConfirmation: confirmPassword,
    });

    if (error) {
      setError(true);
      setErrorMessage(error.details[0].message);
      return;
    }

    setError(false);
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/reset-password', {
        code,
        password,
        passwordConfirmation: confirmPassword,
      });
      navigate('/login', {
        state: {
          error: false,
          success: true,
        },
      });
    } catch (error) {
      navigate('/login', {
        state: {
          error: true,
          message:
            'Code has already been used or expired. Get new one by clicking "forgot password?" below.',
        },
      });
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
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TextField
            id='password'
            label='Password'
            variant='outlined'
            sx={{ marginTop: '30px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            type='password'
          />
          <TextField
            id='passwordConfirm'
            label='Confirm Password'
            variant='outlined'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error}
          />
          {error ? (
            <Typography variant='body1' color='error'>
              {errorMessage}
            </Typography>
          ) : null}
          <Button
            variant='contained'
            sx={{ width: '150px', marginBottom: '20px' }}
            onClick={handleChange}
          >
            Update Password
          </Button>
        </>
      )}
    </Box>
  );
};

export default PassConfirm;
