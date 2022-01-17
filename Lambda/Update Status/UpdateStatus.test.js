let { handler } = require("./UpdateStatus")

jest.setTimeout(10000)
describe('Update Room Lambda Test', () => {
   
/*
        test('All Rooms', async () => {
            expect(
                await handler({
                })
            ).toHaveProperty("statusCode", 200);
        })

        test('Rooms ByUserID', async () => {
            expect(
                await handler({
                    Filter:{
                   
                        ByUser:{
                            id:"446846"
                        }
                    } 
                })
            ).toHaveProperty("statusCode", 200);
        })*/

        test('Update Room By ID', async () => {
            expect(
                await handler({
                    headers:{
                      Authorization:"Bearer 19|5DvGGC2kEXQSnf7FfBS1Dvjoo1G3IkfxeRdcvO3J"
                    },
                    body:{
                      Filter: {
                        ByRoom: {
                          id: "30",
                        },
                      },
                      Update:[
                        {
                          name:"status",
                          value:false
                        }
                      ]
                    }
                  })
            ).toHaveProperty("statusCode", 200);
        })
     

      
    
})
