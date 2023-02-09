import { viteMockServe } from 'vite-plugin-mock'

export function configMockServerPlugin(isBuild: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,

    // injectCode代码注入的文件,默认为项目根目录下src/main.{ts,js}
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  })
}
