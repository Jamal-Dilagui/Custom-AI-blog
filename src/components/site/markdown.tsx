'use client'

import ReactMarkdown from 'react-markdown'
import { memo } from 'react'

export const Markdown = memo(function Markdown({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        components={{
          // we rely on default element rendering; styled via .article-prose CSS
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  )
})
