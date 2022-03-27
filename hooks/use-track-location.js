import { useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";
const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // const [location, setLocation] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const success = (position) => {
    const { latitude, longitude } = position.coords;
    // setLocation(`${latitude},${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { location: `${latitude},${longitude}` },
    });
    setLocationErrorMsg("");
    setIsTracking(false);
  };
  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsTracking(false);
  };
  const handleTrackLocation = () => {
    setIsTracking(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsTracking(false);
    } else {
      //   setLocationErrorMsg("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return {
    handleTrackLocation,
    locationErrorMsg,
    isTracking,
  };
};
export default useTrackLocation;
