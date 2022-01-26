/**
 * A simple parser for Jevko
 */
export const parse = (str, {
  open = '[',
  close = ']',
  escape = '`'
} = {}) => {
  const parents = []
  let parent = {subjevkos: []}, buffer = '', isDigraph = false
  let line = 1, column = 1
  for (let i = 0; i < str.length; ++i) {
    const c = str[i]
    if (c === '\n') {
      ++line
      column = 1
    } else {
      ++column
    }
    if (isDigraph) {
      if (c === escape || c === open || c === close) {
        buffer += c
        isDigraph = false
      } else throw Error(`Invalid escape at ${line}:${column}!`)
    } else if (c === escape) {isDigraph = true}
    else if (c === open) {
      const jevko = {subjevkos: []}
      parent.subjevkos.push({prefix: buffer, jevko})
      parents.push(parent)
      parent = jevko
      buffer = ''
    } else if (c === close) {
      parent.suffix = buffer
      buffer = ''
      if (parents.length < 1) throw Error(`Unexpected close at ${line}:${column}!`)
      parent = parents.pop()
    } else {buffer += c}
  }
  if (isDigraph || parents.length > 0) throw Error(`Unexpected end at ${line}:${column}!`)
  parent.suffix = buffer
  parent.open = open
  parent.close = close
  parent.escape = escape
  return parent
}