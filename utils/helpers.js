const { MAX_PER_PAGE } = require("./constants");

function clamp({ min = -Infinity, max = Infinity, value } = {}) {
  return Math.min(Math.max(value, min), max);
}

function calculatePagination({
  count,
  perPage,
  currentPage,
  maxPerPage = MAX_PER_PAGE,
}) {
  const actualPerPage = clamp({
    min: 1,
    value: perPage,
    max: maxPerPage,
  });
  const totalPage = Math.ceil(count / actualPerPage);

  const page = clamp({
    min: 1,
    value: currentPage,
    max: totalPage,
  });

  const nextPage = clamp({
    min: 1,
    value: page + 1,
    max: totalPage,
  });

  const prevPage = clamp({
    min: 1,
    value: page - 1,
    max: totalPage,
  });

  const skip = (page - 1) * actualPerPage;

  return { page, nextPage, prevPage, totalPage, skip };
}

module.exports = {
  clamp,
  calculatePagination,
};
