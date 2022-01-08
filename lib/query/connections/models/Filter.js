const UserConnections = require("./Connection--Default")

module.exports = class Filter {

    values = [];
    statement = "";


    constructor( filters ){

        //filters = [ { name:String, value:String  }, ... ]
        let ListOfValidFilters = Object.keys( new UserConnections({ userID:"44165", roomID:"Sfafasfafa", ConnectionsIDs:"FAFASFA" }))
       // console.log(ListOfValidFilters);
        let filterOrderdbyKey = {}
        filters.map( filter => { 
            let { name, value } = filter
            if( (!name && name !== "" )|| (!value && value !== "")  ) throw `Invalid Filter Format >> Should be [{ name:"", value:"" }, ...]'`

        if(ListOfValidFilters.indexOf(filter.name) === -1) {
            throw `Invalid Filter >> ${filter.name} \n 
            Lsit of Valid Filters >> ${ListOfValidFilters}`
        }else{
            filterOrderdbyKey[name] ? filterOrderdbyKey[name]+=1 : filterOrderdbyKey[name] = 1;
            this.values.push( value );
            this.statement.length ? this.statement += ` ${filterOrderdbyKey[filter.name] > 1 ? 'OR' : 'AND'} \"${filter.name}\"=? ` : this.statement += ` WHERE \"${filter.name}\"=? `;
        }
       
    })
    //console.log(this.values);
}

//query statement

//values

}
