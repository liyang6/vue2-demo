import { parseHTML } from './parse'
import { generate } from './generate'
export function compileToFunctions(template) {
  /* 
     1、html => sat语法树(用来描述语言本身)
     

     虚拟dom 用对象描述节点
  */
  let ast = parseHTML(template)

  //2、 优化静态节点

  //3、通过这树生成新代码
  let code = generate(ast)

  //4、将字符串转换成函数,通过with取值
  let render = new Function(`with(this){return ${code}}`)

  return render
}