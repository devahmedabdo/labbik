function isISODate(str) {
  return !isNaN(Date.parse(str));
}
function buildFilter(query, extraMatch = {}) {
  const filter = { ...extraMatch };
  const excludedFields = ["page", "limit", "sort", "order"];
for (let key in query) {
  // Parse keys like "createdAt[gte]"
  const match = key.match(/^(.+)\[(.+)\]$/);
  if (match) {
    const field = match[1];
    const operator = `$${match[2]}`;
    let val = query[key];

    if (isISODate(val)) val = new Date(val);
    else if (!isNaN(val)) val = +val;
    else if (operator === '$in' && typeof val === 'string') val = val.split(',');

    if (!filter[field]) filter[field] = {};
    filter[field][operator] = val;
    continue;
  }

  // Everything else (unchanged)
  if (excludedFields.includes(key)) continue;

  const val = query[key];
  if (val === "true" || val === "false") {
    filter[key] = val === "true";
  } else if (isISODate(val)) {
    filter[key] = new Date(val);
  } else if (!isNaN(val)) {
    filter[key] = +val;
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

async function getData(Model, query, extraMatch = {}, populateFields = []) {
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
    filter
  };
}
module.exports = getData;
