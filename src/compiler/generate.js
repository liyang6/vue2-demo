const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = ''
  attrs.forEach(attr => {
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  });

  return `{${str.slice(0, -1)}}`
}
function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else if (node.type === 3) {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }

    let tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0 //如果正则是全局模式，每次使用前设置为0
    let match, index //每次匹配到的结果
    while (match = defaultTagRE.exec(text)) {
      index = match.index //保存匹配到的索引
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`
  }
}
function genChildren(el) {
  const { children } = el
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}
export function generate(el) {
  let children = genChildren(el)
  let code = `_c(${JSON.stringify(el.tag
  )},${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${
    children ? `,${children}` : ''
    })`

  return code
}