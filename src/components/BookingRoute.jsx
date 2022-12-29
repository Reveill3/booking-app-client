import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

const BookingRoute = ({ children }) => {
  const { state } = useContext(BookingContext);
  const { startDate, endDate, location, vehicle, submitted, agree } = state;
  if (!startDate || !endDate || !location || !vehicle) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default BookingRoute;
