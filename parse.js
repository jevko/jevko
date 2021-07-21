/**
 * A simple parser for Jevko
 */
export const parse = (str) => {
  const parents = []
  let parent = [], buffer = '', isEscaped = false
  for (let i = 0; i < str.length; ++i) {
    const c = str[i]
    if (isEscaped) {buffer += c; isEscaped = false}
    else if (c === '`') {isEscaped = true}
    else if (c === '[') {
      if (buffer !== '') {parent.push(buffer); buffer = ''}
      const node = []
      parent.push(node); parents.push(parent); parent = node
    } else if (c === ']') {
      if (buffer !== '') {parent.push(buffer); buffer = ''}
      if (parents.length < 1) throw Error('Unexpected close!')
      parent = parents.pop()
    } else {buffer += c}
  }
  if (isEscaped || parents.length > 0) throw Error('Unexpected end!')
  return parent
}