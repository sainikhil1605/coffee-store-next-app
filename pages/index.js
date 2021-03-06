import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import coffeeStores from "../coffee-stores.json";
import Banner from "../components/Banner";
import Card from "../components/Card";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores, fetchCoffeStores } from "../lib/coffee-store";
import styles from "../styles/Home.module.css";
import { ACTION_TYPES, StoreContext } from "../store/store-context";
export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isTracking } =
    useTrackLocation();
  // const [fetchedCoffeeStores, setFetchedCoffeeStores] = useState([]);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores: fetchedCoffeeStores, location } = state;
  useEffect(() => {
    const getData = async () => {
      if (location) {
        try {
          const resp = await fetch(
            `/api/getCoffeeStoresByLocation?location=${location}&limit=6`
          );
          const fetchedData = await resp.json();
          // setFetchedCoffeeStores(fetchedData);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: fetchedData,
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    };
    getData();
  }, [location]);
  const handleClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffe Connoissuer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isTracking ? "Loading..." : "View Stores nearby"}
          handleClick={handleClick}
        />
        {locationErrorMsg && <p>{locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="hero"
            about="hero"
            width={700}
            height={400}
          />
        </div>
        {fetchedCoffeeStores.length > 0 && (
          <h2 className={styles.heading2}>Stores near me</h2>
        )}
        <div className={styles.cardLayout}>
          {fetchedCoffeeStores.map((store) => (
            <Card
              key={store.fsq_id}
              name={store.name}
              href={`/coffee-store/${store.fsq_id}`}
              imgUrl={
                store.imgUrl ||
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
              }
            />
          ))}
        </div>
        {props.coffeeStores.length > 0 && (
          <h2 className={styles.heading2}>Toronto stores</h2>
        )}

        <div className={styles.cardLayout}>
          {props.coffeeStores.map((store) => (
            <Card
              key={store.fsq_id}
              name={store.name}
              href={`/coffee-store/${store.fsq_id}`}
              imgUrl={
                store.imgUrl ||
                "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores("43.76,-79.39", 6);
  return {
    props: {
      coffeeStores,
    },
  };
}
