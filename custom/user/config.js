let Models = []



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
