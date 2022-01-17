let { handler } = require("./GetMessages");

describe("GetMessages Lambda Test", () => {
  /*

        test('All Messages', async () => {
            expect(
                await handler({
                })
            ).toHaveProperty("statusCode", 200);
        })
*//*
  test("Messages ByUserID", async () => {
    expect(
      await handler({
        Filter: {
          ByUser: {
            id: "44s6846",
          },
        },
      })
    ).toHaveProperty("statusCode", 200);
  });*/

  test("Messages ByRoomID", async () => {
    expect(
      await handler({
        headers:{
          Authorization:"Bearer 21|WUo6LW6JNUJvMBvAsQlCR9yTELOGkCrmQQ7rMBUu"
        },
        body:{
          Filter: {
            ByRoom: {
              id: "10",
            },
          }
        }
      })
    ).toHaveProperty("statusCode", 200);
  });
  
});
