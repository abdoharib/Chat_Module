let { handler } = require("./GetRooms")


describe('GetRoom Lambda Test', () => {
   

        test('All Rooms', async () => {
            expect(
                await handler({
                  
                })
            ).toHaveProperty("statusCode", 200);
        })
     

        test('All Rooms', async () => {
            expect(
                await handler({
                    roomID:"5b5a3942-60d1-4e45-bbc0-deaaa123da31"
                })
            ).toHaveProperty("statusCode", 200);
        })
        
      
    
})
