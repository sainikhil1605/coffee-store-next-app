import { createApi } from "unsplash-js";
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY,
});
export const fetchCoffeeStores = async (query, latLong, limit) => {
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
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&radius=100000&limit=${limit}`,
      options
    );
    coffeeStores = await response.json();
  } catch (e) {
    console.log(e);
  }
  const photos = await unsplashApi.search.getPhotos({
    query: "Coffee Shop",
    perPage: coffeeStores.results.length,
  });
  const unsplashResults = photos.response.results.map(
    (res) => res.urls["small"]
  );
  console.log(unsplashResults);
  console.log(coffeeStores.results);
  return coffeeStores.results.map((venue, ind) => {
    return {
      ...venue,
      imgUrl: unsplashResults[ind],
    };
  });
};
