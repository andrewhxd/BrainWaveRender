import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { AIAssistant } from '../../../components/ai/AIAssistant';
import { aiService } from '../../../services/aiService';

// Mock the AI service
vi.mock('../../../services/aiService', () => ({
  aiService: {
    getGroupMessages: vi.fn(() => Promise.resolve([])),
    getGroupFiles: vi.fn(() => Promise.resolve([])),
    generateResponse: vi.fn(() => Promise.resolve('This is a test AI response'))
  }
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe('AIAssistant Component', () => {
  const defaultProps = {
    groupId: '123',
    isOpen: true,
    onToggle: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly when open', () => {
    render(<AIAssistant {...defaultProps} />);
    expect(screen.getByText('StudyAI Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Ask me to summarize discussions/i)).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AIAssistant {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('StudyAI Assistant')).not.toBeInTheDocument();
  });

  test('displays suggestion options', () => {
    render(<AIAssistant {...defaultProps} />);
    expect(screen.getByText('Summarize recent discussions')).toBeInTheDocument();
    expect(screen.getByText('Generate quiz questions')).toBeInTheDocument();
    expect(screen.getByText('Explain a concept')).toBeInTheDocument();
  });

  test('clicking a suggestion fills the input field', () => {
    render(<AIAssistant {...defaultProps} />);
    fireEvent.click(screen.getByText('Summarize recent discussions'));
    
    const input = screen.getByPlaceholderText('Ask StudyAI anything...');
    expect(input.value).toBe('Please summarize the key points from recent discussions in this study group.');
  });
  
  test('handles errors from AI service', async () => {
    // Mock error response
    aiService.generateResponse.mockImplementationOnce(() => 
      Promise.reject(new Error('API error'))
    );
    
    render(<AIAssistant {...defaultProps} />);
    
    // Enter a prompt and submit
    const input = screen.getByPlaceholderText('Ask StudyAI anything...');
    fireEvent.change(input, { target: { value: 'Test question' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });

  test('toggle button calls onToggle function', () => {
    render(<AIAssistant {...defaultProps} />);
    
    // Click the toggle button - use a more specific selector
    const toggleButton = screen.getByLabelText('Toggle AI Assistant');
    fireEvent.click(toggleButton);
    
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  test('disables submit button when no input or selection', () => {
    render(<AIAssistant {...defaultProps} />);
    
    const submitButton = screen.getByLabelText('Send message');
    expect(submitButton).toBeDisabled();
    
    // Add input and check button is enabled
    const input = screen.getByPlaceholderText('Ask StudyAI anything...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(submitButton).not.toBeDisabled();
  });

  test('formats timestamp correctly', async () => {
    render(<AIAssistant {...defaultProps} />);
    
    // Submit a prompt to create a message
    const input = screen.getByPlaceholderText('Ask StudyAI anything...');
    fireEvent.change(input, { target: { value: 'test message' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Check that timestamp is formatted and displayed
    await waitFor(() => {
      // The exact time will depend on the test environment, so we're just checking the format
      const timestamp = screen.getByText(/\d{1,2}:\d{2}/);
      expect(timestamp).toBeInTheDocument();
    });
  });

}); 