import { getRecords, table } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { fsq_id } = req.query;
  try {
    if (fsq_id) {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `fsq_id = "${fsq_id}"`,
        })
        .firstPage();
      if (findCoffeeStoreRecords.length !== 0) {
        const records = getRecords(findCoffeeStoreRecords);
        res.json(records);
      } else {
        res.status(400).json({ error: "record not found" });
      }
    } else {
      res.status(400).json({ error: "Id is missing" });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({ message: "Something went wrong" });
  }
};

export default getCoffeeStoreById;
