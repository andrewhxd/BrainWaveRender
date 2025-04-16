import { describe, test, expect, beforeEach, vi } from 'vitest';
import { supabaseMock, mockData, resetSupabaseMock } from '../../__mocks__/supabaseMock';

// Mock the supabase module - this shows how to use the supabaseMock in tests
vi.mock('../../lib/supabase', () => ({
  supabase: supabaseMock
}));

describe('Supabase Mock Example', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    resetSupabaseMock();
  });

  test('should retrieve data from a table', async () => {
    // Set up the test
    const result = await supabaseMock.from('users').select().eq('id', 'user1');
    
    // Verify the result contains our mock data
    expect(result.data).toBe(mockData.users);
    
    // Verify the correct methods were called
    expect(supabaseMock.from).toHaveBeenCalledWith('users');
  });

  test('should insert data into a table', async () => {
    // Data to insert
    const newUser = { id: 'user3', email: 'user3@example.com', full_name: 'Test User 3' };
    
    // Insert the data
    await supabaseMock.from('users').insert([newUser]);
    
    // Verify the correct methods were called
    expect(supabaseMock.from).toHaveBeenCalledWith('users');
  });

  test('should get file from storage', async () => {
    // Get a file from storage
    const { data } = await supabaseMock.storage.from('documents').list('123');
    
    // Verify we got our mock files
    expect(data).toEqual(mockData.files);
    
    // Verify the correct methods were called
    expect(supabaseMock.storage.from).toHaveBeenCalledWith('documents');
  });

  test('should generate a public URL for a file', () => {
    // Get a public URL
    const { data } = supabaseMock.storage.from('documents').getPublicUrl('123/document.pdf');
    
    // Verify the URL was generated
    expect(data.publicUrl).toBe('https://mock-url.com/123/document.pdf');
  });

  test('should handle auth operations', async () => {
    // Get the current user
    const { data: userData } = await supabaseMock.auth.getUser();
    
    // Verify we got our mock user
    expect(userData.user).toEqual(mockData.users[0]);
    
    // Sign in
    const { data: signInData } = await supabaseMock.auth.signIn({
      email: 'user1@example.com',
      password: 'password123'
    });
    
    // Verify we got our mock sign-in response
    expect(signInData.user).toEqual(mockData.users[0]);
    expect(signInData.session.access_token).toBe('mock-token');
  });

  test('should handle realtime subscriptions', () => {
    // Callback for subscription events
    const callback = vi.fn();
    
    // Subscribe to changes
    supabaseMock.channel('room-1')
      .on('INSERT', callback)
      .subscribe();
      
    // Verify our callback was triggered with the mock data
    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0]).toHaveProperty('new');
    expect(callback.mock.calls[0][0]).toHaveProperty('eventType', 'INSERT');
  });
}); 