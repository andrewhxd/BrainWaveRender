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
}); 