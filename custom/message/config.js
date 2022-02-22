let Models = [
    {
        Name:"author",
        Type:"object",
        Validator: (val) =>{
            console.log(val.hasOwnProperty("type") && val.hasOwnProperty("id"));
            return val.hasOwnProperty("type") && val.hasOwnProperty("id")
        }  
    },
    {
        Name:"file_type",
        Type:"string",
        Required: true,
        Validator: (val) =>{
            if(val === "file" || val === "text") return true;
            return false;
        }  
    }
]
















module.exports = {

	Models: Models,
    Operations:{
        
        Clear: () => {
            Models = [];
            return Models
        },

        Add: (model) => {
            Models.push(model);
        },

        Replace: (modles) => {
            Models = modles;
        }
        
    }
};
