let { handler } = require("./AddRoom")


describe('AddRoom Lambda Test', () => {
   

        test('With Users ', async () => {
            expect(
                await handler({
                   users:[
                       {
                           id:"446846",
                           type:"user"
                       }
                   ]
                })
            ).toHaveProperty("statusCode", 200);
        })
        
        test('With  No Users ', async () => {
            expect(
                await handler({
    
                })
            ).toHaveProperty("statusCode", 200);
        })
        
      
    
})
