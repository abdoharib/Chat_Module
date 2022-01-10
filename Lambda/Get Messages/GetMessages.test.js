let { handler } = require("./GetMessages");

describe("GetMessages Lambda Test", () => {
  /*

        test('All Messages', async () => {
            expect(
                await handler({
                })
            ).toHaveProperty("statusCode", 200);
        })
*/
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
  });

  test("Messages ByRoomID", async () => {
    expect(
      await handler({
        Filter: {
          ByRoom: {
            id: "safasf",
          },
        },
      })
    ).toHaveProperty("statusCode", 200);
  });
  
});
