import { useState } from "react";
const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [location, setLocation] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const success = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation(`${latitude},${longitude}`);
    setLocationErrorMsg("");
  };
  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsTracking(false);
  };
  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsTracking(false);
    } else {
      setIsTracking(true);
      //   setLocationErrorMsg("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
      setIsTracking(false);
    }
  };
  return {
    location,
    handleTrackLocation,
    locationErrorMsg,
    isTracking,
  };
};
export default useTrackLocation;
