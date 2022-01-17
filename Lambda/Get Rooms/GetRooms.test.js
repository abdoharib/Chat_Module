const { StopUserImportJobRequest } = require("@aws-sdk/client-cognito-identity-provider");
let { handler } = require("./GetRooms")

jest.setTimeout(10000)
describe('GetRoom Lambda Test', () => {
   
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

        test('Rooms ByRoomID', async () => {
            expect(
                await handler({
                    headers:{
                      Authorization:"Bearer 19|5DvGGC2kEXQSnf7FfBS1Dvjoo1G3IkfxeRdcvO3J"
                    },
                    body:{
                      Filter: {
                        ByRoom: {
                          id: "40",
                        },
                      }
                    }
                  })
            ).toHaveProperty("statusCode", 200);
        })
     

      
    
})
