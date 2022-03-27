import { findRecordByFilter, getRecords, table } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const {
      fsq_id,
      name,
      address,
      imgUrl,
      neighborhood,
      voting = 0,
    } = req.body;
    try {
      if (fsq_id) {
        const records = await findRecordByFilter(fsq_id);
        console.log(records);
        if (records.length !== 0) {
          res.status(200).json(records);
        } else {
          if (name) {
            const createCoffeeStoreRecords = await table.create([
              {
                fields: {
                  fsq_id,
                  name,
                  imgUrl,
                  address,
                  neighborhood,
                  voting,
                },
              },
            ]);

            const records = getRecords(createCoffeeStoreRecords);
            return res.status(200).json(records);
          } else {
            res.status(400).json({ error: "Id or name is missing" });
          }
        }
      } else {
        res.status(400).json({ error: "Id is missing" });
      }
    } catch (e) {
      console.log(e);
      return res.status(200).json({ message: "Something went wrong" });
    }
  }
};
export default createCoffeeStore;
