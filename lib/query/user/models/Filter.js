const User = require("./user--Default");

module.exports = class Filter {
  values = [];
  statement = "";

  constructor(filters) {
    if (!filters || (Array.isArray(filters) && filters.length == 0)) {
    } else {
      //filters = [ { name:String, value:String  }, ... ]
      let ListOfValidFilters = Object.keys(
        new User({ userID: "44165", roomID: "56151" })
      );
      // console.log(ListOfValidFilters);
      let filterOrderdbyKey = {};
      filters.map((filter) => {
        let { name, value } = filter;
        if ((!name && name !== "") || (!value && value !== ""))
          throw `Invalid Filter Format >> Should be [{ name:"", value:"" }, ...]'`;

        if (ListOfValidFilters.indexOf(filter.name) === -1) {
          throw `Invalid Filter >> ${filter.name} \n 
             Lsit of Valid Filters >> ${ListOfValidFilters}`;
        } else {
          filterOrderdbyKey[name]
            ? (filterOrderdbyKey[name] += 1)
            : (filterOrderdbyKey[name] = 1);
          this.values.push(value);
          this.statement.length
            ? (this.statement += ` ${
                filterOrderdbyKey[filter.name] > 1 ? "OR" : "AND"
              } \"${filter.name}\"=? `)
            : (this.statement += ` WHERE \"${filter.name}\"=? `);
        }
      });
    }

    //console.log(this.values);
  }
  statement = "";
  values = [];
  //query statement

  //values
};
