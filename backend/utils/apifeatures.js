class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  //search feature of the api
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

      this.query = this.query.find({...keyword});
      return this;
  }

  filter(){
    const queryCopy = {...this.queryStr};
    //console.log(queryCopy);

    //removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach(key => delete queryCopy[key]);


    //filter for Price and Rating
    //console.log(queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}` );

    this.query = this.query.find(JSON.parse(queryStr));

    //console.log(queryStr);
    //console.log(queryCopy);
   // this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resultPerPage){
    const currentPage = Number(this.queryStr.page) || 1;

    //how many products we are skipping 
    const skip = resultPerPage * (currentPage-1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  
  }


}

module.exports = ApiFeatures;
