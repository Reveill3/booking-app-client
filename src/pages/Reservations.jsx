import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const user = {};

const reservations = [
  {
    id: 1,
    start: 'Sun Dec 04 2022 20:30:28 GMT-0600 (Central Standard Time)',
    end: 'Sun Dec 04 2022 20:30:28 GMT-0600 (Central Standard Time)',
    car: {
      id: 1,
      make: 'Ford',
      model: 'F-150',
      year: 2021,
    },
    userId: 1,
  },
  {
    id: 1,
    start: 'Sun Dec 04 2022 20:30:28 GMT-0600 (Central Standard Time)',
    end: 'Sun Dec 04 2022 20:30:28 GMT-0600 (Central Standard Time)',
    car: {
      id: 1,
      make: 'Ford',
      model: 'F-150',
      year: 2021,
    },
    userId: 1,
  },
];

const Reservations = () => {
  const navigate = useNavigate();
  const handleDelete = () => {
    console.log('delete');
  };
  return (
    <Container maxWidth='lg' sx={{ marginTop: '50px', marginBottom: '50px' }}>
      <TableContainer component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Vehicle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.start}</TableCell>
              <TableCell>{reservation.end}</TableCell>
              <TableCell>
                {reservation.car.make} {reservation.car.model}{' '}
                {reservation.car.year}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() =>
                    navigate(`/user/reservations/${reservation.id}`, {
                      state: {
                        reservation: { ...reservation },
                      },
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton>
                  <DeleteIcon onClick={handleDelete} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </Container>
  );
};

export default Reservations;
