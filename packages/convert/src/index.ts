import inquirer, { QuestionCollection } from 'inquirer'
import chalk from 'chalk'
import shell from 'shelljs'
import { join } from 'path'
import { pathToFileURL } from 'url'
import type { Method } from 'axios'
import { pathResolve } from 'utils'

interface LogStepOpt {}

interface RequestParamStruct {
  name: string
  in: 'query'
  description: string
  required: boolean
  type?: string
  schema?: {
    type: string
    items: SchemaStruct
  }
}

interface SchemaStruct {
  $ref: string
  originalRef: string
}

interface ResponseStruct {
  description: string
  schema?: SchemaStruct
}

interface PathMethodStruct {
  tags: string[]
  summary: string
  operationId: string
  produces: string[]
  parameters: RequestParamStruct[]
  response: Record<number, ResponseStruct>
}

type SwaggerPathStruct = Record<string, Record<Method, PathMethodStruct>>

type SwaggerJSONStruct = {
  swagger: string
  info: {
    description: string
    version: string
    title: string
    license: {
      name: string
      url: string
    }
  }
  host: string
  tags: (
    | {
        name: string
        description: string
      }
    | string
  )[]
  paths: SwaggerPathStruct
}

/************************************************************************/

const messageMap: Record<number, string> = {
  0: '第一步：🐁 准备转换',
  1: '第二步：🐮 开始转换',
  2: '第三步：🐯 开始转换',
  3: '第四步：🐰 开始转换',
  4: '第五步：🐉 开始转换',
  5: '第六步：🐍 开始转换',
  6: '第七步：🐎 开始转换',
}

function logStep(callbacks: AnyFunction[]) {
  for (let step = 0; step < callbacks.length; step++) {
    console.log(
      chalk.green.bold(`*************** ${messageMap[step]} ***************\n`)
    )
    callbacks[step]()
  }
}

export function convertJson2Ts(path: string) {
  const currentDir = pathResolve('./')
  const SOURCE_PATH = `${pathResolve(path)}`
  const TARGET_PATH = `${pathResolve(path)}`

  // 获取全部等待转换的json文件
  const allWaitConvertFiles = shell
    .ls(SOURCE_PATH)
    .map(file => {
      if (file.match(/\.json$/)) {
        return file
      } else {
        return ''
      }
    })
    .filter(v => v)

  const result = new Map<string, any>()

  logStep(1)
  const questions: QuestionCollection = {
    type: 'checkbox',
    message: '请选择你要转换的JSON文件：',
    name: 'modules',
    choices: [
      ...allWaitConvertFiles.map(v => ({
        value: v,
        name: v,
      })),
    ],
    when: function (answer) {
      return answer['bundleType'] === '2'
    },
    pageSize: 15,
  }
  inquirer
    .prompt([
      {
        type: 'input',
        message: '[1. 整体转换; 2. 自定义转换]',
        default: '1',
        name: 'bundleType',
      },
      questions,
    ])
    .then(res => {
      let files: string[] = []
      if (res.bundleType === '2') {
        // 自定义转换
        console.log(`res===2`, res)
        files = res['modules']
      } else {
        // 整体转换
        console.log(`res===1`, res)
        files = [...allWaitConvertFiles]
      }

      logStep(2)
      // 引入json文件
      for (let i = 0; i < files.length; i++) {
        import(pathToFileURL(join(SOURCE_PATH, files[i])).toString(), {
          assert: {
            type: 'json',
          },
        }).then(res => {
          console.log(`看看看看看${i}`, res)
          const interfaceObj = res['paths']
          Object.keys(interfaceObj).forEach(path => {
            result.set(path, {
              method: interfaceObj['path'],
            })
          })
        })
      }
    })
}

// readdir(
//   SOURCE_PATH,
//   {
//     encoding: 'utf-8',
//   },
//   (_, files) => {
//     console.log(`结果是files`, files)
//     if (files) {
//       for (let i = 0; i < files.length; i++) {
//         {
//           const file = join(SOURCE_PATH, files[i])
//           console.log(`ddddddddddddd`, file, extname(file))
//           if (extname(file) === '.json') {
//             readFile(file, (_, data) => {
//               console.log(`--------`, data)
//             })
//           }
//         }
//       }
//     }
//   }
// )
