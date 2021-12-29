export const memoCheck = function <T>(prevProps: T, nextProps: T) {
  console.log('memoCheck start')
  const keys = Object.keys(prevProps)
  const prev = Object.values(prevProps)
  const result = Object.values(nextProps).reduce((result, current, index) => {
    console.log(`${keys[index]}: ${current} === ${prev[index]}`, current === prev[index])
    return result && current === prev[index]
  }, true)
  console.log('memoCheck end')
  return result
}
