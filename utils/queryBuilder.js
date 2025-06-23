const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const objectIdFields = ["user", "plan", "booking"];

function isISODate(str) {
  return !isNaN(Date.parse(str));
}
function buildFilter(query, extraMatch = {}) {
  const filter = { ...extraMatch };
  const excludedFields = ["page", "limit", "sort", "order"];

  for (let key in query) {
    const match = key.match(/^(.+)\[(.+)\]$/);
    if (match) {
      const field = match[1];
      const operator = `$${match[2]}`;
      let val = query[key];

      if (isISODate(val)) {
        if (operator === "$lte" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
          val = new Date(new Date(val).setUTCHours(23, 59, 59, 999));
        } else {
          val = new Date(val);
        }
      } else if (!isNaN(val)) {
        val = +val;
      } else if (operator === "$in" && typeof val === "string") {
        val = val.split(",");
      }

      if (!filter[field]) filter[field] = {};
      filter[field][operator] = val;
      continue;
    }

    if (excludedFields.includes(key)) continue;

    const val = query[key];

    if (val === "true" || val === "false") {
      filter[key] = val === "true";
    } else if (isISODate(val)) {
      filter[key] = new Date(val);
    } else if (!isNaN(val)) {
      filter[key] = +val;
    } else if (objectIdFields.includes(key) && mongoose.isValidObjectId(val)) {
      filter[key] = new ObjectId(val);
    } else if (query.equal) {
      const [field1, field2] = query.equal.split(":");
      filter.$expr = { $eq: [`$${field1}`, `$${field2}`] };
    } else {
      filter[key] = { $regex: val, $options: "i" };
    }
  }

  return filter;
}
function buildLookups(fieldsWithSelect) {
  const lookups = [];

  for (const fieldObj of fieldsWithSelect) {
    const fieldName = typeof fieldObj === "string" ? fieldObj : fieldObj.name;
    const collectionName =
      typeof fieldObj === "string"
        ? `${fieldObj}s` // fallback: just add 's'
        : fieldObj.from || `${fieldObj.name}s`; // allow overriding collection name
    const select = fieldObj.select || [];

    lookups.push(
      {
        $lookup: {
          from: collectionName,
          let: { localId: `$${fieldName}` },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$localId"] } } },
            ...(select.length
              ? [
                  {
                    $project: select.reduce((acc, key) => ((acc[key] = 1), acc), { _id: 1 }),
                  },
                ]
              : []),
          ],
          as: fieldName,
        },
      },
      {
        $unwind: {
          path: `$${fieldName}`,
          preserveNullAndEmptyArrays: true,
        },
      }
    );
  }

  return lookups;
}

async function getData(Model, query, extraMatch = {}, populateFields = [], selectFields = []) {
  const page = +query.page || 1;
  const limit = +query.limit || +process.env.LIMIT || 10;
  const skip = (page - 1) * limit;

  const filter = buildFilter(query, extraMatch);
  const sortField = query.sort || "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;
  const sortOptions = { [sortField]: sortOrder };
  const lookups = buildLookups(populateFields); // dynamic lookups
  const data = await Model.aggregate([
    { $match: filter },
    ...lookups,
    {
      $facet: {
        data: [{ $sort: sortOptions }, { $skip: skip }, { $limit: limit }, ...(selectFields.length ? [{ $project: selectFields.reduce((acc, key) => ((acc[key] = 1), acc), { _id: 1 }) }] : [])],
        count: [{ $count: "count" }],
      },
    },
  ]);

  return {
    items: data[0].data || [],
    pagination: {
      page,
      limit,
      total: data[0].count.length ? data[0].count[0].count : 0,
    },
  };
}
module.exports = getData;
