let { handler } = require("./GetRooms")


describe('GetRoom Lambda Test', () => {
   

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
        })

        test('Rooms ByRoomID', async () => {
            expect(
                await handler({
                    Filter:{
                   
                        ByRoom:{
                            id:"safasf"
                        }
                    } 
                })
            ).toHaveProperty("statusCode", 200);
        })
     

      
    
})
