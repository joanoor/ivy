export default function () {
  // 详情
  const seeDetail = <T>(row: T, callback?: (row: T) => void) => {
    console.log(`row`, row)
    callback && callback(row)
  }

  // 定位
  const locatePoint = <T>(row: T, callback?: (row: T) => void) => {
    console.log(`row`, row)
    callback && callback(row)
  }

  // 误差
  const deviation = <T>(row: T, callback?: (row: T) => void) => {
    console.log(`row`, row)
    callback && callback(row)
  }

  return {
    seeDetail,
    locatePoint,
    deviation,
  }
}
