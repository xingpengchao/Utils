/**
 * @desc 千分位格式化数字
 * @param  number 金额
 * @return {String} 字符串
 *
 * @example formatPrice(123456789.3343) -> 123,456,789.3343
 */
const formatPrice = number => {
  number = '' + number
  const [ integer, decimal = '' ] = number.split('.')
  return integer.replace(/\B(?=(\d{3})+$)/g, ',') + (decimal ? '.' + decimal : '')
}