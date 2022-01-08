let { handler } = require("./AddMessage")


describe('AddMessage Lambda Test', () => {
   
    describe('User Type', () => {

        test('Valid Parameter ', async () => {
            expect(
                await handler({
                    content: 'heasfasfasfllo',
                    userID: '19484',
                    roomID: '2224',
                })
            ).toHaveProperty("statusCode", 200);
        })
        
        /*
        test('Valid Parameter Missing Content ( optional )', async () => {
            expect(
                await handler({
                    userID: '19484',
                    roomID: '2224',
                })
            ).toHaveProperty("statusCode", 200);
        })
    
        test('Not A Member of The Room', async () => {
            expect(
                await handler({
                    content: 'heasfasfasfllo',
                    userID: '19484',
                    roomID: '2225',
                })
            ).toHaveProperty("statusCode", 500);
        })    

        test('Missing Room ID', async () => {
            expect(
                await handler({
                    content: 'heasfasfasfllo',
                    userID: '19484',
                })
            ).toHaveProperty("statusCode", 500);
        }) 

        test('Missing User ID', async () => {
            expect(
                await handler({
                    content: 'heasfasfasfllo',
                    roomID: '2224',
                })
            ).toHaveProperty("statusCode", 500);
        }) 
        */
    })
    
})
