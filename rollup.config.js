import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js',// 入口
  output: {
    format: 'umd',//模块化类型
    name: 'Vue', //全局变量的名字
    file: "dist/umd/vue.js",
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      port: 3000,
      contentBase: '',
      openPage: '/index.html'
    })
  ]
}