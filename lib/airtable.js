var Airtable = require("airtable");
var base = new Airtable({ apiKey: `${process.env.AIRTABLE_API_KEY}` }).base(
  `${process.env.AIRTABLE_BASE_KEY}`
);

const table = base("coffee-stores");
const getRecords = (records) => {
  return records.map((record) => {
    return {
      recordId: record.id,
      ...record?.fields,
    };
  });
};
const findRecordByFilter = async (fsq_id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `fsq_id = "${fsq_id}"`,
    })
    .firstPage();

  return getRecords(findCoffeeStoreRecords);
};
export { table, getRecords, findRecordByFilter };
