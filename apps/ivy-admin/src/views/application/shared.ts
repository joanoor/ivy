export type AppFormStruct = {
  appName: string
  appUrl: string
  appId: string
  appDesc: string
}

export const handleDeleteApp = (app: AppFormStruct, callback?: Fn) => {
  callback && callback(app)
}
