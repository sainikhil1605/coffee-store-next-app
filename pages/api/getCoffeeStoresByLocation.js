import { fetchCoffeeStores } from "../../lib/coffee-store";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { location, limit } = req.query;
    const response = await fetchCoffeeStores(location, Number(limit));
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(e);
  }
};
export default getCoffeeStoresByLocation;
