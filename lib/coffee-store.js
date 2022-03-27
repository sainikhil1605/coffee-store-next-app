import { createApi } from "unsplash-js";
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY,
});
export const fetchCoffeeStores = async (
  location = "43.70672014428761,-79.39785023092976",
  limit = 8,
  query = "coffee shop"
) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  };
  let coffeeStores = [];
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${location}&radius=100000&limit=${limit}`,
      options
    );
    coffeeStores = await response.json();
    console.log(coffeeStores);
  } catch (e) {
    return e;
  }
  const photos = await unsplashApi.search.getPhotos({
    query: "Coffee Shop",
    perPage: coffeeStores.results.length,
  });
  const unsplashResults = photos.response.results.map(
    (res) => res.urls["small"]
  );
  return coffeeStores.results.map((venue, ind) => {
    return {
      ...venue,
      imgUrl: unsplashResults[ind],
    };
  });
};
export const fetcher = (url) => fetch(url).then((res) => res.json());
