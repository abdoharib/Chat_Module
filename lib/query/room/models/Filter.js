const Room = require("./room--Default");

module.exports = class Filter {

  constructor(filters, updated_values) {

        // updated_values
        if (
            !updated_values ||
            (Array.isArray(updated_values) && updated_values.length == 0)
          ) {
          } else {
            //filters = [ { name:String, value:String  }, ... ]
            //let ListOfValidUpdates = Object.keys( new Room({}) )
            // console.log(ListOfValidFilters);
            let UpdatedOrderdbyKey = {};
            updated_values.map((updated_value) => {
              let { name, value } = updated_value;
              if ((!name && name !== "") || (value == null))
                throw `Invalid updated_value Format >> Should be [{ name:"", value:"" }, ...]'`;
      
              UpdatedOrderdbyKey[name]
                ? (UpdatedOrderdbyKey[name] += 1)
                : (UpdatedOrderdbyKey[name] = 1);
              this.values.push(value);
      
      
              this.update_statement +=
                !UpdatedOrderdbyKey[updated_value.name] > 1 ? "" :
                ` SET \"${updated_value.name}\"=?`;
            });
          }

    if (!filters || (Array.isArray(filters) && filters.length == 0)) {
    } else {
     // console.log(filters);
      //filters = [ { name:String, value:String  }, ... ]
      let ListOfValidFilters = Object.keys(new Room({}));
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

  }

  update_statement = "";
  statement = "";
  values = [];

};
