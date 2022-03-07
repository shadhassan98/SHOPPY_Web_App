class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    //console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // filterByCategory() {
  //   const categoryName = JSON.stringify(this.queryStr.category);
  //   console.log(categoryName);
  //   this.query = this.query.find({ category: JSON.parse(categoryName) });
  //   return this;
  // }

  // filterByPrice() {
  //   let queryString = JSON.stringify(this.queryStr.price);
  //   queryString = queryString.replace(
  //     /\b(gt|gte|lt|lte)\b/g,
  //     (key) => `$${key}`
  //   );
  //   console.log(queryString);
  //   this.query = this.query.find({ price: JSON.parse(queryString) });
  //   return this;
  // }

  // filterByRating() {
  //   let queryString = JSON.stringify(this.queryStr.ratings);
  //   queryString = queryString.replace(
  //     /\b(gt|gte|lt|lte)\b/g,
  //     (key) => `$${key}`
  //   );
  //   console.log(queryString);
  //   this.query = this.query.find({ ratings: JSON.parse(queryString) });
  //   return this;
  // }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
