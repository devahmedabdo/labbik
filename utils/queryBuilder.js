function isISODate(str) {
  return /^\d{4}-\d{2}-\d{2}/.test(str);
}

function buildFilter(query, extraMatch = {}) {
  const filter = { ...extraMatch };
  const excludedFields = ["page", "limit", "sort", "order"];

  for (const key in query) {
    if (excludedFields.includes(key)) continue;

    // Advanced filter (e.g. createdAt[gte]=...)
    if (typeof query[key] === "object") {
      for (const operator in query[key]) {
        if (!filter[key]) filter[key] = {};
        const mongoOp = `$${operator}`;

        let val = query[key][operator];
        if (isISODate(val)) val = new Date(val);
        else if (!isNaN(val)) val = +val;

        filter[key][mongoOp] = val;
      }
    }
    // Boolean
    else if (query[key] === "true" || query[key] === "false") {
      filter[key] = query[key] === "true";
    }
    // Date
    else if (isISODate(query[key])) {
      filter[key] = new Date(query[key]);
    }
    // Number
    else if (!isNaN(query[key])) {
      filter[key] = +query[key];
    }
    // String (partial match)
    else {
      filter[key] = { $regex: query[key], $options: "i" };
    }
  }

  return filter;
}
function buildLookups(fields) {
  const lookups = [];

  for (const field of fields) {
    lookups.push(
      { $lookup: {
          from: field === 'plan' ? 'plans' : `${field}s`, // you can enhance this logic
          localField: field,
          foreignField: '_id',
          as: field
        }
      },
      { $unwind: { path: `$${field}`, preserveNullAndEmptyArrays: true } }
    );
  }

  return lookups;
}
async function getData(Model, query, extraMatch = {},populateFields=[]) {
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
        data: [{ $sort: sortOptions }, { $skip: skip }, { $limit: limit }],
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
