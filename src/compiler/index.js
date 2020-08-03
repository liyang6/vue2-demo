const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g



function parseHTML(html) {
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

  let root = null
  let currentParent;
  let stack = [];// 标签校验符合预期 <div><span></span></div> ['div','span']

  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  function end(tagName) {
    let element = stack.pop() // 取最后一个
    currentParent = stack[stack.length - 1]
    if (currentParent) { //在闭合时知道这个标签的父亲，并设置他的儿子
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.trim()
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }


  while (html) { //html不为空一直解析
    let textEnd = html.indexOf('<') // 标签开始结束都是<开头
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() //开始标签匹配的结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag) //开始标签匹配的结果
      if (endTagMatch) { // 处理结束标签
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }

    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) { // 处理文本
        advance(text.length)
        chars(text)
      }
    }

  }
  function advance(n) {  // 将字符串进行截取操作，更新html
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) //删除开始标签

      let end;
      let attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length) //去掉当前属性
      }

      if (end) {
        advance(end.length) //去掉标签结束符号
        return match
      }
    }
  }

  return root
}


export function compileToFunctions(template) {
  /* 
     1、html => sat语法树(用来描述语言本身)
     2、通过这树生成新代码

     虚拟dom 用对象描述节点
  */
  let ast = parseHTML(template)
  console.log('ast', ast);

}