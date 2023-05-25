describe('Testing in new Project', () => {
    
    test('This test cant fail', () => {
    
        // 1. Initialization
        const message1 = 'Hello Victra';
    
        // 2. Estimulation
        const message2 = message1.trim();
        
        // 3. Watching the expected behavior
        expect( message1 ).toBe( message2 );
    
    });
    
});