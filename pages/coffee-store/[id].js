import cls from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { fetchCoffeeStores, fetcher } from "../../lib/coffee-store";
import { StoreContext } from "../../store/store-context";
import styles from "../../styles/coffee-store.module.css";
export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findStoreById = coffeeStores.find(
    (item) => item.fsq_id.toString() === params.id
  );
  console.log({ findStoreById });
  console.log({ coffeeStore: findStoreById ? findStoreById : {} });
  return {
    props: {
      coffeeStore: findStoreById ? findStoreById : {},
    },
  };
}
export async function getStaticPaths() {
  const coffeStoresData = await fetchCoffeeStores();
  const paths = coffeStoresData.map((coffeStore) => ({
    params: {
      id: coffeStore.fsq_id.toString(),
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

const handleCreateCoffeeStore = async (coffeStore) => {
  try {
    const { fsq_id, name, voting, imgUrl, location } = coffeStore;
    console.log(coffeStore);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fsq_id,
        name,
        voting,
        imgUrl,
        neighborhood: location?.neighborhood?.[0] || "",
        address: location?.address || "",
      }),
    };
    const resp = await fetch("/api/createCoffeeStore", options);
    const data = await resp.json();
  } catch (err) {
    console.log(err);
  }
};
const CoffeeStore = (initialProps) => {
  const router = useRouter();
  const [coffeeStore, setCoffeStore] = useState(
    initialProps?.coffeeStore || {}
  );
  const id = router.query.id;
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);
  const [votingCount, setVotingCount] = useState(0);
  const { data, error } = useSWR(
    `/api/getCoffeeStoreById?fsq_id=${id}`,
    fetcher
  );
  const handleUpVoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };
  useEffect(() => {
    if (
      initialProps?.coffeeStore &&
      Object?.keys?.(initialProps?.coffeeStore).length === 0
    ) {
      if (coffeeStores.length > 0) {
        const findStoreById = coffeeStores.find(
          (item) => item.fsq_id.toString() === id
        );
        console.log(findStoreById);
        if (findStoreById) {
          setCoffeStore(findStoreById);
          handleCreateCoffeeStore(findStoreById);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps?.coffeeStore);
    }
  }, [id, initialProps, coffeeStores, setCoffeStore]);
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data from SWR", data);
      setCoffeStore(data[0]);
      setVotingCount(data[0]?.voting);
    }
  }, [data]);
  console.log({ coffeeStore });
  if (error) {
    return <div>Something Went Wrong</div>;
  }
  if (router.isFallback) {
    return <div>Loading....</div>;
  }

  const { name = "", imgUrl = "" } = coffeeStore;
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>{"<-"} Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" />

            <p className={styles.text}>
              {coffeeStore?.location?.address ||
                coffeeStore?.address ||
                "Address Unavailable"}
            </p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            {coffeeStore?.location?.neighborhood ||
              (coffeeStore?.neighborhood && (
                <p className={styles.text}>
                  {coffeeStore?.location?.neighborhood ||
                    coffeeStore?.neighborhood}
                </p>
              ))}
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};
export default CoffeeStore;
