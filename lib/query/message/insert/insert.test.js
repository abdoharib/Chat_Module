let insert = require('./insert');
//const  { Operations:{ Clear, Add, Replace } , Models} = require('../models/CustomConfig');

let config = []
function Add(model) {
	config.push(model)
}
function Replace(models) {
	config = models;
}
function Clear(models) {
	config = [];
}
describe('Insert New Message', () => {

	/*
    //default Paramater
	describe('Default Attribute Cases', () => {

        //clear custom models
		Clear()

        //Valid
		test('Valid Param ', async () => {
			expect(
				await insert({
					content: 'hello',
					userID: '19484',
					roomID: '2224',
				})
			).toBeTruthy();
		});


        //Missing Optional
        describe('Missing Optional', () => {

            test('No Content', async () => {
                expect(
                    await insert({
                        userID: '19484',
                        roomID: '2224'
                    })
                ).toBeTruthy();
            });

        })

        
        //Missing Required
		test('Missing Required ', async () => {
			let err;
			await insert({
				content: 'hello'
			}).catch((e) => {
				expect(e).toBe('userID & roomID are Required');
			});
		});

	});
	*/

    describe('Custom Attribute Cases', () => {

		//clear just in case
		Clear()
		
		test('Config File Invalid Models Structure', async () => {
			

			let err;
			await insert({
				content: 'hello',
				userID: '19484',
				roomID: '2224',
			},config).catch((e) => {
				console.log(e);
				expect(e).toBe('Invalid Custom Attrbuite File Structure, You Must Export An Array Of Objects');
			});
		});

		
		
		describe('Stages Cases', () => {
			
			Clear()

			describe('Missing Required Stages', () => {


				test('Missing Name', async () => {
			
					//clear 
					Clear()
					Add({ Type: 'string' })
		
					let err;
					await insert({
						content: 'hello',
						userID: '19484',
						roomID: '2224',
					},config).catch((e) => {
						expect(e).toBe('property "Name" is Misssing from the Config File. ||| property "Name" is Required');
					});
				});

				test('Missing Type', async () => {
			
					//clear 
					Clear()
					Add({  Name: 'memes',})
		
					await insert({
						content: 'hello',
						userID: '19484',
						roomID: '2224',
					},config).catch((e) => {
						expect(e).toBe('property "Type" is Misssing from the Config File. ||| property "Type" is Required');
					});
				});
			})
			
		
			describe('Invalid Stage Value Type', () => {
				
				test('Invalid Name value type', async () => {
				Clear()
				Add({
					Name: { name : "afsaf" },
					Type: 'string'
				})

				let err;
					await insert({
						content: 'hello',
						userID: '19484',
						roomID: '2224',
					},config).catch((e) => {
						
						expect(e).toBe(`The Name Prop of the Attribute Must be A string`);
					})
				})

				test('Invalid Type value type', async () => {
					Clear()
					Add({
						Name: "asfasf",
						Type: { type:'string' }
					})
	
					let err;
						await insert({
							content: 'hello',
							userID: '19484',
							roomID: '2224',
						}, config).catch((e) => {
							expect(e).toBe(`The Type Prop of the Attribute Must be A string`);
						})
				})

				test('Invalid Required value type', async () => {
					Clear()
					Add({
						Name: "asfasf",
						Type: "string",
						Required:"safaf"
					})
	
					let err;
						await insert({
							content: 'hello',
							userID: '19484',
							roomID: '2224',
						}, config).catch((e) => {
							expect(e).toBe(`The Required Prop of the Attribute Must be A boolean`);
						})
				})

				test('Invalid Validator value type', async () => {
					Clear()
					Add({
						Name: "asfasf",
						Type: "string",
						//it should be function
						Validator: "afafafsaf"
					})
	
					let err;
						await insert({
							content: 'hello',
							userID: '19484',
							roomID: '2224',
						}, config).catch((e) => {
							expect(e).toBe(`The Validator Prop of the Attribute Must be A function`);
						})
				})

			})
/*
			describe('Invalid Stage Value', () => {
				
				// its the only one that has valid values function
				test('Invalid Type value', async () => {
					Clear()
					Add({	
						Name: 'memes',
						
						// it should be one of these [ 'object', 'string', 'number', 'boolean' ]
						Type: 'mememe'
					})
	
					let err;
						await insert({
							content: 'hello',
							userID: '19484',
							roomID: '2224',
						}).catch((e) => {
							expect(e).toBe('The Type Prop of the memes Attribute is Not Valid');
						})
				})
					
			})

			describe('Valid Stages', () => {

				describe('Arrtibute Cases', () => {
					Clear()
					describe('with Required Model Arrtibute', () => {
						Clear()
						Add({
							Name: 'memes',
							Type: 'string',
							Required: true
						})

						test('Data Provided', async() => {
							expect(
								await insert({
									content: 'hello',
									userID: '19484',
									roomID: '2224',
									memes:"asfasf"
								})
							).toBeTruthy();
						})

						test('Data Not Provided', async() => {

							await insert({
								content: 'hello',
								userID: '19484',
								roomID: '2224',
							}).catch((e) => {
								expect(e).toBe('The memes Attribuite is Not A Valid Type');
							});

						})
						
					})

					describe('without Required Model Arrtibute', () => {
						Clear()
						Add({
							Name: 'memes',
							Type: 'string',
						})

						test('Data Provided', async() => {
							expect(
								await insert({
									content: 'hello',
									userID: '19484',
									roomID: '2224',
									memes:"asfasf"
								})
							).toBeTruthy();
						})
						})

						test('Data Not Provided', async() => {
							expect(
								await insert({
									content: 'hello',
									userID: '19484',
									roomID: '2224',
								})
							).toBeTruthy();
						})
						})
						
			})

			test('Attribuite Exsit As Default', () => {
				Clear()
				Add({
					Name: 'userID',
					Type: 'string',
				})

				await insert({
					content: 'hello',
					userID: '19484',
					roomID: '2224',
					memes:"safasf"
				}).catch((e) => {
					expect(e).toBe(`memes Attrbuite Name Already Exsit As Default Attrbuite`);
				});
				
				
			})
		*/
			
		})
			
		


	})
	


})
