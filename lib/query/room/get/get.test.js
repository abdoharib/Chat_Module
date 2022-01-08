let get = require("./get")


describe("Get Rooms", () => {
/*
    test('Valid Filter Single', async () => {
        expect( await get([{name:"roomID", value:"2224"}]) ).toBeInstanceOf(Array)
    })
*/
    test('Valid Filter Multiple', async () => {
        expect( await get([
        {name:"roomID", value:"2224"},
        {name:"id", value:"65edb08c-d942-46dc-b118-a5c5393f4bee"},
        {name:"userID", value:"19484"},
        {name:"time", value:"1640101259553"},
        {name:"content", value:""}
    ])).toBeInstanceOf(Array)
    })

    test('Valid Filter Multiple Duplicate', async () => {
        expect( await get([{name:"id", value:"ef515e6c-177b-4dfd-8cf7-245cad494923"}, {name:"id", value:"65edb08c-d942-46dc-b118-a5c5393f4bee"}]) ).toBeInstanceOf(Array)
    })
    

    test('Invalid Filter Non Existing Propties', async () => {
        let err;
        await get([{name:"room_ID", value:"2224"}])
        .catch(e => {
            console.log(e);
            expect(e).toMatch(/Invalid Filter >>/);
        }) 
    })

    test('Invalid Filter Format', async () => {
        let err;
        await get([{Name:"roomID", Values:"2224"}])
        .catch(e => {
            console.log(e);
            expect(e).toMatch(/Invalid Filter Format >>/);
        }) 
    })
    
})
