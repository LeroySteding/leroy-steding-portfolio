import React from 'react';

/**
 * Parses translation strings with special tags and converts them to React elements
 * Supports: <highlight>text</highlight> and <strong>text</strong>
 */
export function parseTranslation(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  // Match <highlight>...</highlight> or <strong>...</strong> tags
  const regex = /<(highlight|strong)>(.*?)<\/\1>/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the tag
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }
    
    // Add the tagged content with appropriate styling
    const tag = match[1];
    const content = match[2];
    
    if (tag === 'highlight') {
      // Alternate between cyan and violet highlights
      const className = parts.length % 2 === 0 
        ? "text-neon-cyan font-semibold" 
        : "text-neon-violet font-semibold";
      parts.push(
        <span key={match.index} className={className}>
          {content}
        </span>
      );
    } else if (tag === 'strong') {
      parts.push(
        <span key={match.index} className="text-text-primary font-semibold">
          {content}
        </span>
      );
    }
    
    currentIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }
  
  return <>{parts}</>;
}
