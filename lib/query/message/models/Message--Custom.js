//Message Data Model
const crypto = require('crypto');
const Message = require('./Message--Default');
const _rules = require('./Rules');
//const {Models} = require('./CustomConfig');

const defaultAttr = [ "id", "time","content", "userID", "roomID" ] 

module.exports = class Messages_Custom extends Message {
	constructor(prop, Models) {
		super(prop);

        
        //check if the Models variable is an array
        if( !(Models instanceof Array) )throw "Invalid Custom Attrbuite File Structure, You Must Export An Array Of Objects"
        //console.log(Models);
        //loop over user custom parma
		for (const CurrentParam of Models) {
            //loop over stages //which describe how should we handel every key in the the user custom param
			
            //checks if the Attrbuite is an Object
            if( !isObject(CurrentParam) ) throw "Invalid Custom Attrbuite, it Must Be an Object";

            for (const stage of _rules.stages) {

                //check if there is Name key in this Parama which it should because its required 
                
                if( CurrentParam[stage.Name] ){

                    //check if attr name is part of the default att
                    if(defaultAttr.indexOf(CurrentParam[stage.Name]) !== -1 ) throw `${CurrentParam.Name} Attrbuite Name Already Exsit As Default Attrbuite`;
                    
                    // check the if the attribute name prop is a string which logically should be
                   if(typeof CurrentParam[stage.Name] !== stage.ValueType) throw `The ${stage.Name} Prop of the Attribute Must be A ${stage.ValueType}`;

                   //check if it has a valid function and validate it, the valid function must return true of false
                   if ( stage.Valid && !stage.Valid( CurrentParam[stage.Name] ) ) throw `The ${stage.Name} Prop of the ${CurrentParam.Name} Attribute is Not Valid`;


                }else{
                    //if not check if this key is required
                    if(stage.Required){
                        //throw the provided error
                        throw stage.Required.error
                    }//else do noting and go to the next parma
                }
			}
          //  console.log(prop);
            // after looping over all stages that means that the info for the current custom attrbiute is Valid, and we should proceed to register it to class
            if(prop.hasOwnProperty(CurrentParam.Name)){
        
                //check type
                if( CurrentParam.Type !== typeof prop[CurrentParam.Name] ) throw `The ${CurrentParam.Name} Attribuite is Not A Valid Type`;
                
                //check if there is validator for this attr and use it 
                if( CurrentParam.Validator && CurrentParam.Validator( prop[CurrentParam.Name] ) ) throw `The ${CurrentParam.Name} Attribuite Dosn't Have A Valid Value`;
                                
                //register prop
                this[CurrentParam.Name] = prop[CurrentParam.Name];

            }else if(CurrentParam.Required){
                //if its required throw error
                throw `The ${CurrentParam.Name} Attribuite is Not A Valid Type`;
            }
        }
    };
}



// checks if a var is javascript Object
const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};