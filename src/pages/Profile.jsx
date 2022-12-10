import {
  Container,
  TextField,
  Box,
  Stack,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import ClearIcon from '@mui/icons-material/Clear';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const user = {
  id: 1,
};

const Profile = () => {
  const navigate = useNavigate();

  if (
    !localStorage.getItem('token') ||
    Date.now() > localStorage.getItem('expiresAt')
  ) {
    navigate('/login');
  }

  const { data, loading, error, reFetch } = useFetch(
    `/api/users/me?populate=*`,
    'auth'
  );

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    insurance: [],
    files: [],
  });

  const [insuranceError, setInsuranceError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const matches = useMediaQuery(useTheme().breakpoints.up('sm'));

  useEffect(() => {
    setInputs({
      firstName: data?.first_name,
      lastName: data?.last_name,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      files: [],
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    const updatedUser = {
      first_name: inputs.firstName,
      last_name: inputs.lastName,
      email: inputs.email,
      phone: inputs.phone,
      address: inputs.address,
    };

    const newImgArray = [];
    try {
      if (inputs.files.length > 0) {
        const insuranceData = new FormData();
        insuranceData.append('files', inputs.files[0]);
        insuranceData.append('ref', 'plugin::users-permissions.user');
        insuranceData.append('refId', data.id);
        insuranceData.append('field', 'insuranceImgs');
        if (inputs.files[1]) {
          insuranceData.append('files', inputs.files[1]);
        }
        const insurance = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,
          insuranceData,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
      }

      const updated = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/me`,

        updatedUser,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      setUploadLoading(false);

      reFetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileAdd = (newFiles) => {
    setInsuranceError(false);
    setInputs((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const handleDelete = async (id) => {
    try {
      setUploadLoading(true);
      const deletedImg = await axios.delete(
        `${process.env.REACT_APP_API_URL}/upload/files/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      setUploadLoading(false);
      reFetch();
    } catch (error) {
      console.log(error);
      setErrorMessage('Error deleting file');
      setDeleteError(true);
    }
  };
  return (
    <Container maxWidth='lg'>
      {loading || !data || uploadLoading ? (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', marginTop: '50px', marginBottom: '50px' }}>
          <Stack sx={{ flex: 4 }} gap={5}>
            {uploadError || deleteError ? (
              <Alert severity='error'>{errorMessage}</Alert>
            ) : null}
            <Box gap={5} display='flex'>
              <TextField
                name='firstName'
                value={inputs.firstName}
                label='First Name'
                variant='outlined'
                onChange={handleChange}
              />
              <TextField
                name='lastName'
                value={inputs.lastName}
                label='Last Name'
                variant='outlined'
                onChange={handleChange}
              />
            </Box>
            <TextField
              name='email'
              value={inputs.email}
              label='Email'
              variant='outlined'
              onChange={handleChange}
            />
            <TextField
              name='phone'
              value={inputs.phone}
              label='Phone'
              variant='outlined'
              onChange={handleChange}
            />
            <TextField
              name='address'
              value={inputs.address}
              label='Address'
              variant='outlined'
              onChange={handleChange}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant='h6'>
                Insurance Card (Two Files Only)
              </Typography>
              <Stack direction='row' gap={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography mb={3} textAlign='center'>
                    Current Insurance Uploaded
                  </Typography>
                  <Stack direction='row' gap={3}>
                    {data.insuranceImgs?.map((image) => {
                      return (
                        <Box
                          key={image.id}
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            marginRight: '10px',
                          }}
                        >
                          {image.mime === 'application/pdf' ? (
                            <PictureAsPdfIcon sx={{ fontSize: '50px' }} />
                          ) : (
                            <InsertPhotoIcon sx={{ fontSize: '50px' }} />
                          )}
                          <Typography>{image.name}</Typography>
                          <Button
                            color='error'
                            onClick={() => handleDelete(image.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
              <FileUploader
                maxSize={100}
                types={['png', 'jpg', 'pdf']}
                handleChange={handleFileAdd}
                multiple
                onTypeError={() => {
                  setInsuranceError(true);
                  setErrorMessage('File type not supported');
                }}
                children={
                  <Box
                    sx={{
                      border: '5px dotted black',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '10px',
                    }}
                  >
                    {inputs.files?.length > 0 ? (
                      inputs.files.map((file) => {
                        return (
                          <Box
                            key={file.name}
                            sx={{
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                            }}
                          >
                            {file.type === 'application/pdf' ? (
                              <PictureAsPdfIcon sx={{ fontSize: '50px' }} />
                            ) : (
                              <InsertPhotoIcon sx={{ fontSize: '50px' }} />
                            )}
                            <Typography variant='subtitle1' textAlign='center'>
                              {file.name}
                            </Typography>
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                              }}
                              onClick={(e) => {
                                setInputs((prev) => ({
                                  ...prev,
                                  files: prev.files.filter((f) => f !== file),
                                }));
                              }}
                            >
                              <ClearIcon color='error' />
                            </IconButton>
                          </Box>
                        );
                      })
                    ) : (
                      <Box sx={{ cursor: 'pointer' }}>
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                          <AttachFileIcon
                            sx={{
                              fontSize: '50px',
                            }}
                          />
                        </Box>
                        <Typography variant='subtitle2'>
                          Drag and Drop Insurance Card Images
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
              <Button
                color='error'
                variant='contained'
                onClick={() =>
                  setInputs((prev) => ({
                    ...prev,
                    files: [],
                  }))
                }
              >
                Reset Insurance Uploads (Wont Delete Current Insurance)
              </Button>
              {insuranceError && (
                <Typography color='error' variant='subtitle2'>
                  {errorMessage}
                </Typography>
              )}
            </Box>
            <Button variant='contained' onClick={handleSubmit}>
              Update Info
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('expiresAt');
                navigate('/');
              }}
            >
              LOGOUT
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
