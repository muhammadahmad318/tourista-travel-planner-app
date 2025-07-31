import { createContext, useContext, useState } from "react";

// Create the context
export const TripContext = createContext(null);

// Custom hook to use the trip context
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
};

// Provider component
export const TripProvider = ({ children }) => {
  const [tripData, setTripData] = useState({});

  const resetTripData = () => {
    setTripData({});
  };

  return (
    <TripContext.Provider value={{ tripData, setTripData, resetTripData }}>
      {children}
    </TripContext.Provider>
  );
};
