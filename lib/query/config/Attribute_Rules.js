module.exports = {

	stages: [
		
		{
			Name: 'Required',
			ValueType: 'boolean',
		},

		{
			Name: 'Name',
			ValueType: 'string',
			Required: {
				value: true,
				error: 'property "Name" is Misssing from the Config File. ||| property "Name" is Required'
			},
			//if tru
		},
	
		{
			Name: 'Type',
			ValueType: 'string',
			//the value must be on if these strings
			Valid: v => ([ 'object', 'string', 'number', 'boolean' ].indexOf(v) !== -1),
			Required: {
				value: true,
				error: 'property "Type" is Misssing from the Config File. ||| property "Type" is Required'
			},
		},
		{
			Name: 'Validator',
			ValueType: 'function',
		},
	]
    
};
