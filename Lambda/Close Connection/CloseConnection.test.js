let { handler } = require('./CloseConnection');

describe('CloseConnection Lambda Test', () => {
    
	test('Valid Parameter ', async () => {
		expect(
			await handler({
				ConnectionsIDs: 'sfafsafdsafdasfasfafa464684864'
			})
		).toHaveProperty('statusCode', 200);
	});

	test('Invalid Parameter ', async () => {
		expect(
			await handler({
				ConnectionsIDs: ''
			})
		).toHaveProperty('statusCode', 500);
	});

});
