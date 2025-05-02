import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MarkdownRendererProps {
  content: string
  className?: string
  allowHtml?: boolean
  variant?: 'default' | 'compact' | 'lesson-plan' | 'chat'
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  allowHtml = true,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'prose prose-sm dark:prose-invert max-w-none',
    compact: 'prose-xs space-y-2 max-w-none',
    'lesson-plan':
      'prose prose-sm prose-headings:text-indigo-700 dark:prose-headings:text-indigo-300 max-w-none',
    chat: 'prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0.5',
  }

  // Transform content to handle special elements (like disclaimers)
  const transformContent = (content: string) => {
    // Remove empty paragraphs
    let transformedContent = content.replace(/<p>\s*<\/p>/g, '')

    // Replace any custom elements
    transformedContent = transformedContent.replace(
      /<div class="disclaimer">(.*?)<\/div>/g,
      (match, p1) => `<div class="disclaimer">${p1.trim()}</div>`
    )

    return transformedContent
  }

  // Define customized component overrides for markdown-to-jsx
  const overrides = {
    // Custom components for different elements
    code: ({ children, className, ...props }: React.HTMLProps<HTMLElement>) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      if (className && language) {
        return (
          <div className="relative my-4">
            <div className="absolute top-2 right-2 rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {language}
            </div>
            <SyntaxHighlighter
              language={language}
              style={materialOceanic}
              PreTag="div"
              className="overflow-hidden rounded-md"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        )
      }

      return (
        <code
          className={cn(
            'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200',
            className
          )}
          {...props}
        >
          {children}
        </code>
      )
    },

    h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
      <h1 className="mt-6 mb-4 text-2xl font-bold" {...props}>
        {children}
      </h1>
    ),

    h2: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
      <h2 className="mt-5 mb-3 text-xl font-bold" {...props}>
        {children}
      </h2>
    ),

    h3: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
      <h3 className="mt-4 mb-2 text-lg font-bold" {...props}>
        {children}
      </h3>
    ),

    p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => (
      <p className="my-2" {...props}>
        {children}
      </p>
    ),

    ul: ({ children, ...props }: React.HTMLProps<HTMLUListElement>) => (
      <ul
        className="my-3 list-disc pl-6"
        {...(props as React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLUListElement>,
          HTMLUListElement
        >)}
      >
        {children}
      </ul>
    ),

    ol: ({ children, ...props }: React.HTMLProps<HTMLOListElement>) => (
      <ol
        className="my-3 list-decimal pl-6"
        {...(props as React.DetailedHTMLProps<
          React.OlHTMLAttributes<HTMLOListElement>,
          HTMLOListElement
        >)}
      >
        {children}
      </ol>
    ),

    li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
      <li className="my-1" {...props}>
        {children}
      </li>
    ),

    a: ({ href, children, ...props }: React.HTMLProps<HTMLAnchorElement>) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),

    blockquote: ({ children, ...props }: React.HTMLProps<HTMLQuoteElement>) => (
      <blockquote
        className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic dark:border-gray-600 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),

    table: ({ children, ...props }: React.HTMLProps<HTMLTableElement>) => (
      <div className="my-4 overflow-x-auto">
        <table
          className="min-w-full border-collapse border border-gray-300 dark:border-gray-700"
          {...props}
        >
          {children}
        </table>
      </div>
    ),

    th: ({ children, ...props }: React.HTMLProps<HTMLTableHeaderCellElement>) => (
      <th
        className="border border-gray-300 bg-gray-100 px-4 py-2 text-left dark:border-gray-700 dark:bg-gray-800"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }: React.HTMLProps<HTMLTableDataCellElement>) => (
      <td className="border border-gray-300 px-4 py-2 dark:border-gray-700" {...props}>
        {children}
      </td>
    ),

    hr: (props: React.HTMLProps<HTMLHRElement>) => (
      <hr className="my-6 border-t border-gray-300 dark:border-gray-700" {...props} />
    ),

    img: ({ src, alt }: React.HTMLProps<HTMLImageElement>) => {
      if (!src) return null
      return (
        <div className="my-4 h-auto max-w-full">
          <Image
            src={src}
            alt={alt || ''}
            width={800}
            height={500}
            className="rounded"
            style={{ objectFit: 'contain' }}
            loading="lazy"
          />
        </div>
      )
    },

    // Handle custom elements like disclaimers
    div: ({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) => {
      if (className === 'disclaimer') {
        return (
          <div
            className="my-4 rounded border-l-4 border-red-500 bg-red-50 p-4 font-medium text-red-700 dark:bg-red-950 dark:text-red-200"
            {...props}
          >
            {children}
          </div>
        )
      }
      return (
        <div className={className} {...props}>
          {children}
        </div>
      )
    },
  }

  return (
    <div className={cn(variantStyles[variant], className)}>
      <Markdown
        options={{
          overrides,
          forceBlock: true,
          forceWrapper: true,
          // Enable HTML parsing if allowHtml is true
          disableParsingRawHTML: !allowHtml,
        }}
      >
        {transformContent(content)}
      </Markdown>
    </div>
  )
}

export default MarkdownRenderer
