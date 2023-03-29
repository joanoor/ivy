export default function () {
  const canSelect = (
    row: any,
    index: number,
    callback?: (row, index) => void
  ) => {
    callback && callback(row, index)
  }

  return {
    canSelect,
  }
}
