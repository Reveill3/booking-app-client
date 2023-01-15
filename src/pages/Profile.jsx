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
import { makeRequest } from '../makeRequest';
import CircularProgress from '@mui/material/CircularProgress';
import joi from 'joi';

const schema = joi.object({
  first_name: joi
    .string()
    .pattern(/^([^0-9]*)$/)
    .required(),
  last_name: joi
    .string()
    .pattern(/^([^0-9]*)$/)
    .required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: joi
    .string()
    .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .allow(null),
  address: joi.string().allow(null),
  insurance_name: joi
    .string()
    .pattern(/^([^0-9]*)$/)
    .allow(null),
  insurance_policy: joi.string().allow(null),
  drivers_license_number: joi.string().pattern(/^\d+$/).allow(null),
});

const Profile = () => {
  const navigate = useNavigate();

  if (
    !localStorage.getItem('token') ||
    Date.now() > localStorage.getItem('expiresAt')
  ) {
    navigate('/login');
  }

  const { data, loading, error, reFetch } = useFetch(`/users/me?populate=*`);

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    insurance: [],
    files: [],
    insurance_name: '',
    insurance_policy: '',
    drivers_license_number: '',
  });

  const [insuranceError, setInsuranceError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();

  const { breakpoints } = theme;

  const matches = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    setInputs({
      firstName: data?.first_name,
      lastName: data?.last_name,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      files: [],
      insurance_name: data?.insurance_name,
      insurance_policy: data?.insurance_policy,
      drivers_license_number: data?.drivers_license_number,
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
      insurance_name: inputs.insurance_name,
      insurance_policy: inputs.insurance_policy,
      drivers_license_number: inputs.drivers_license_number,
    };

    // validate updatedUser
    const { error } = schema.validate(updatedUser);
    if (error) {
      setUploadLoading(false);
      setErrorMessage(error.details[0].message);
      setUploadError(true);
      return;
    }
    setUploadError(false);
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
        const insurance = await makeRequest().post('/upload', insuranceData);
      }

      const updated = await makeRequest().put(`/user/me`, updatedUser);
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
      const deletedImg = await makeRequest().delete(`/upload/files/${id}`);
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
            <Stack
              direction={matches ? 'row' : 'column'}
              justifyContent='space-between'
              gap={5}
            >
              <TextField
                sx={{
                  flex: 1,
                }}
                name='email'
                value={inputs.email}
                label='Email'
                variant='outlined'
                onChange={handleChange}
              />
              <TextField
                sx={{
                  flex: 1,
                }}
                name='insurance_policy'
                value={inputs.insurance_policy}
                label='Policy Number'
                variant='outlined'
                onChange={handleChange}
              />
            </Stack>
            <Stack
              direction={matches ? 'row' : 'column'}
              justifyContent='space-between'
              gap={5}
            >
              <TextField
                sx={{ flex: 1 }}
                name='phone'
                value={inputs.phone}
                label='Phone'
                variant='outlined'
                onChange={handleChange}
              />
              <TextField
                sx={{ flex: 1 }}
                name='insurance_name'
                value={inputs.insurance_name}
                label='Insurance Company Name'
                variant='outlined'
                onChange={handleChange}
              />
            </Stack>
            <Stack
              direction={matches ? 'row' : 'column'}
              justifyContent='space-between'
              gap={5}
            >
              <TextField
                sx={{ flex: 1 }}
                name='address'
                value={inputs.address}
                label='Address'
                variant='outlined'
                onChange={handleChange}
              />
              <TextField
                sx={{ flex: 1 }}
                name='drivers_license_number'
                value={inputs.drivers_license_number}
                label='Divers License Number'
                variant='outlined'
                onChange={handleChange}
              />
            </Stack>

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
