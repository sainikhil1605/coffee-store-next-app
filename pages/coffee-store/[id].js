import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import coffeStoresData from "../../coffee-stores.json";
import cls from "classnames";
import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-store";
export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores(
    "coffee shop",
    "43.70672014428761,-79.39785023092976",
    6
  );
  return {
    props: {
      coffeeStore: coffeeStores.find(
        (item) => item.fsq_id.toString() === params.id
      ),
    },
  };
}
export async function getStaticPaths() {
  const coffeStoresData = await fetchCoffeeStores(
    "coffee shop",
    "43.70672014428761,-79.39785023092976",
    6
  );
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
const handleUpVoteButton = () => {
  console.log("upvote");
};
const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading....</div>;
  }

  const {
    location: { address, neighborhood },
    name,
    imgUrl,
  } = coffeeStore;
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

            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            {neighborhood && <p className={styles.text}>{neighborhood}</p>}
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>1</p>
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
