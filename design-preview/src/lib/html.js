import React from 'react'

const SELF_CLOSING = new Set(['br'])
const TAG_PATTERN = /<(\/?)(em|strong|sub|sup|br|span|b|i)(\s[^>]*)?\/?>/gi

export function parseHtml(html) {
  if (!html) return null
  const decoded = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')

  const matches = [...decoded.matchAll(new RegExp(TAG_PATTERN.source, 'gi'))]
  if (matches.length === 0) return decoded

  const parts = []
  const stack = []
  let lastIdx = 0
  let key = 0

  for (const m of matches) {
    const [full, slash, tag, attrs] = m
    const tagLower = tag.toLowerCase()
    const idx = m.index

    if (idx > lastIdx) {
      const text = decoded.slice(lastIdx, idx)
      if (stack.length > 0) stack[stack.length - 1].children.push(text)
      else parts.push(text)
    }
    lastIdx = idx + full.length

    if (SELF_CLOSING.has(tagLower)) {
      const br = React.createElement('br', { key: key++ })
      if (stack.length > 0) stack[stack.length - 1].children.push(br)
      else parts.push(br)
      continue
    }

    if (slash) {
      let collected = []
      while (stack.length > 0) {
        const frame = stack.pop()
        if (frame.tag === tagLower) {
          const children = [...frame.children, ...collected.reverse()]
          const props = { key: key++ }
          if (frame.className) props.className = frame.className
          const el = React.createElement(tagLower, props, ...children)
          if (stack.length > 0) stack[stack.length - 1].children.push(el)
          else parts.push(el)
          break
        }
        collected.push(...frame.children)
      }
    } else {
      let className = null
      if (attrs) {
        const cm = attrs.match(/class="([^"]*)"/) || attrs.match(/className="([^"]*)"/)
        if (cm) className = cm[1]
      }
      stack.push({ tag: tagLower, children: [], className })
    }
  }

  if (lastIdx < decoded.length) {
    const tail = decoded.slice(lastIdx)
    if (stack.length > 0) stack[stack.length - 1].children.push(tail)
    else parts.push(tail)
  }

  while (stack.length > 0) {
    const frame = stack.pop()
    const target = stack.length > 0 ? stack[stack.length - 1].children : parts
    target.push(...frame.children)
  }

  if (parts.length === 1 && typeof parts[0] === 'string') return parts[0]
  return React.createElement(React.Fragment, null, ...parts)
}
