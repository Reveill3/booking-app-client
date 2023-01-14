import { createContext, useEffect, useReducer } from 'react';

const initialState = {
  vehicle: JSON.parse(localStorage.getItem('vehicle')) || null,
  startDate: JSON.parse(localStorage.getItem('startDate')) || null,
  endDate: JSON.parse(localStorage.getItem('endDate')) || null,
  location: JSON.parse(localStorage.getItem('location')) || null,
  submitted: JSON.parse(localStorage.getItem('submitted')) || false,
  agreed: false,
  new_customer: false,
};

export const BookingContext = createContext(initialState);

const BookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VEHICLE':
      return {
        ...state,
        vehicle: action.payload,
      };
    case 'SET_START_DATE':
      return {
        ...state,
        startDate: action.payload,
      };
    case 'SET_END_DATE':
      return {
        ...state,
        endDate: action.payload,
      };
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.payload,
      };

    case 'RESET':
      return {
        vehicle: null,
        startDate: null,
        endDate: null,
        location: null,
        submitted: false,
        agreed: false,
      };
    case 'SUBMIT':
      return {
        ...state,
        submitted: action.payload,
      };
    case 'AGREE':
      return {
        ...state,
        agree: action.payload,
      };
    case 'NEW_CUSTOMER':
      return {
        ...state,
        new_customer: action.payload,
      };

    default:
      return state;
  }
};

export const BookingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BookingReducer, initialState);

  useEffect(() => {
    localStorage.setItem('vehicle', JSON.stringify(state.vehicle));
    localStorage.setItem('startDate', JSON.stringify(state.startDate));
    localStorage.setItem('endDate', JSON.stringify(state.endDate));
    localStorage.setItem('location', JSON.stringify(state.location));
    localStorage.setItem('submitted', JSON.stringify(state.submitted));
    localStorage.setItem('agreed', JSON.stringify(state.agree));
    localStorage.setItem('new_customer', JSON.stringify(state.new_customer));
  }, [state]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};
