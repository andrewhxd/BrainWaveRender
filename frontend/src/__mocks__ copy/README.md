# Supabase Testing Mocks

This directory contains mock implementations of external dependencies that are used in testing.

## supabaseMock.js

`supabaseMock.js` provides a complete mock implementation of the Supabase client for use in tests. It simulates all the main functionalities of Supabase including:

- Database queries (tables)
- Storage operations
- Authentication
- Realtime subscriptions

### How to Use

1. Import the supabaseMock in your test file:

```js
import { supabaseMock, mockData, resetSupabaseMock } from '../../__mocks__/supabaseMock';
```

2. Mock the Supabase module in your test:

```js
vi.mock('../../lib/supabase', () => ({
  supabase: supabaseMock
}));
```

3. Reset the mock before each test:

```js
beforeEach(() => {
  resetSupabaseMock();
});
```

4. Use in your tests:

```js
test('example test', async () => {
  // Query data
  const result = await supabaseMock.from('users').select();
  
  // Assert
  expect(result.data).toEqual(mockData.users);
  expect(supabaseMock.from).toHaveBeenCalledWith('users');
});
```

### Mock Data

The `mockData` object contains predefined test data for common tables:

- `users`
- `messages`
- `files`
- `study_groups`

You can customize this data for specific tests or add more data as needed.

### Customizing Query Results

For more complex test scenarios, you can customize the mock responses:

```js
// Override a response for a specific test
supabaseMock.from.mockImplementationOnce(() => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ 
    data: { id: 'custom-id', name: 'Custom Data' }, 
    error: null 
  })
}));
```

### Testing Error Handling

To test error handling, you can override methods to return errors:

```js
// Mock an error response
supabaseMock.from.mockImplementationOnce(() => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ 
    data: null, 
    error: { message: 'Database error', code: 'MOCK_ERROR' } 
  })
}));
```

### Example

See the example test file at `src/__tests__/examples/supabaseExample.test.js` for a complete demonstration of how to use the supabaseMock in tests.

## Running Tests

To run the tests with these mocks:

```bash
npm run test
```

Or in watch mode:

```bash
npm run test:watch
``` 