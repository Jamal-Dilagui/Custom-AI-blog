'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { memo } from 'react'

export const Markdown = memo(function Markdown({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  )
})
