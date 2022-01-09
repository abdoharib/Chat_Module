let { handler } = require("./OpenConnection")


describe('OpenConnection Lambda Test', () => {

        test('Valid Parameter ', async () => {
            expect(
                await handler({
                    userID: '19485',
                    roomID: '2224',
                })
            ).toHaveProperty("statusCode", 200);
    })

    test('Invalid Parameter ', async () => {
        expect(
            await handler({
                userID: '19485',
            })
        ).toHaveProperty("statusCode", 500);
})
    
})
