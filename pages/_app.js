import { createContext, useReducer } from "react";
import { StoreContext, storeReducer } from "../store/store-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const initialState = {
    location: "",
    coffeeStores: [],
  };
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <Component {...pageProps} />
    </StoreContext.Provider>
  );
}

export default MyApp;
