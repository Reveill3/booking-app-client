import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Container,
  IconButton,
  Skeleton,
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Link, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import { useRef, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const Reservations = () => {
  const containerRef = useRef(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const theme = useTheme();
  const {
    data: reservations,
    loading,
    error,
    reFetch,
  } = useFetch('/reservations/me');

  const navigate = useNavigate();

  const startDelete = () => {
    setDeleteConfirm(true);
  };

  // function to delete reservation and associated unavailable dates from strapi db
  const handleDelete = async (id) => {
    try {
      await axios.post(
        `/api/reservations/me/${id}`,
        {
          entity: 'api::reservation.reservation',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      reFetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth='lg' sx={{ marginTop: '50px', marginBottom: '50px' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Vehicle</TableCell>
            </TableRow>
          </TableHead>
          {!reservations ? (
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton variant='rectangular' width={85} height={30} />
                </TableCell>

                <TableCell>
                  <Skeleton variant='rectangular' width={85} height={30} />
                </TableCell>
                <TableCell>
                  <Skeleton variant='rectangular' width={85} height={30} />
                </TableCell>
                <TableCell>
                  <Skeleton variant='circular' width={30} height={30} />
                </TableCell>
                <TableCell>
                  <Skeleton variant='circular' width={30} height={30} />
                </TableCell>
                <TableCell>
                  <Skeleton variant='circular' width={30} height={30} />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {reservations?.map((reservation) => {
                return (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      {DateTime.fromISO(reservation.start).toLocaleString(
                        DateTime.DATETIME_MED
                      )}
                    </TableCell>
                    <TableCell>
                      {DateTime.fromISO(reservation.end).toLocaleString(
                        DateTime.DATETIME_MED
                      )}
                    </TableCell>
                    <TableCell>
                      {`${reservation.car.make} ${reservation.car.model} ${reservation.car.year}`}
                    </TableCell>
                    {reservation.status === 'awaiting_session_complete' && (
                      <TableCell>
                        {
                          <a href={reservation.stripeUrl}>
                            <IconButton>
                              <CreditCardIcon />
                            </IconButton>
                          </a>
                        }
                      </TableCell>
                    )}
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          navigate(`/user/reservations/${reservation.id}`, {
                            state: {
                              reservation: {
                                ...reservation,
                              },
                            },
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell ref={containerRef} width={225}>
                      <Stack
                        direction='row'
                        spacing={2}
                        alignItems='center'
                        height='100%'
                        overflow='hidden'
                      >
                        <Slide
                          direction='right'
                          in={!deleteConfirm}
                          container={containerRef.current}
                          mountOnEnter
                          unmountOnExit
                          appear={false}
                          timeout={200}
                          easing={{
                            enter: theme.transitions.easing.easeInOut,
                            exit: theme.transitions.easing.easeInOut,
                          }}
                        >
                          <IconButton onClick={startDelete}>
                            <DeleteIcon />
                          </IconButton>
                        </Slide>
                        <Slide
                          container={containerRef.current}
                          direction='left'
                          in={deleteConfirm}
                          mountOnEnter
                          unmountOnExit
                          timeout={200}
                          easing={{
                            enter: theme.transitions.easing.easeInOut,
                            exit: theme.transitions.easing.easeInOut,
                          }}
                        >
                          <Stack
                            direction='row'
                            alignItems='center'
                            width='80%'
                          >
                            <IconButton
                              onClick={() => handleDelete(reservation.id)}
                            >
                              <CheckIcon color='success' />
                            </IconButton>
                            <IconButton onClick={() => setDeleteConfirm(false)}>
                              <ClearIcon color='error' />
                            </IconButton>
                            <Typography variant='caption' whiteSpace='nowrap'>
                              You sure?
                            </Typography>
                          </Stack>
                        </Slide>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Reservations;
