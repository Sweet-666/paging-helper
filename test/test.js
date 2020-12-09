require('@babel/register')({
  presets: [
      ['@babel/preset-env', { modules: 'commonjs'}],
      ['@babel/preset-typescript']
  ],
  extensions: ['.ts']
})

const PageHelper = require('../build/PageHelper').default
require('mocha')

describe('分页测试', () => {
  const pageCount = 36
  const limit = 10
  
  let data = []
  let offset = 0
  for (let i = 0; i < pageCount; i++) {
    data.push(i)
  }


  let stdPage = new PageHelper(limit, offset)
  stdPage.setCount(pageCount)
  it('首次加载数据', (done) => {
    let initData = data.slice(offset, offset + limit)
    stdPage.setData(initData)
    if (stdPage.offset === 0 && stdPage.accumulator.length === limit) {
      done()
    } else {
      done('offset 或 accumulator 有误')
    }
    
  })
  it('下拉加载', (done) => {
    for (let i = 0; i < Math.floor(pageCount / limit); i++) {
      // 加载每一页
      let start = offset + limit
      let end = start + limit
      stdPage.loadMore(data.slice(start, end))
      offset = start
      if (
        !(
          stdPage.offset === start 
          && (
            stdPage.accumulator.length === end 
            || (stdPage.accumulator.length === data.length && i + 1 > i < Math.floor(pageCount / limit))
          )
        )
      ) {
        console.log(stdPage.offset, stdPage.accumulator)
        done('翻页有误')
      }
    }
    done()
  })
})