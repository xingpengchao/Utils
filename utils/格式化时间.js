
/**
 * @desc 格式化时间兼容Ios
 * @param  val 时间
 * @param  format 格式
 * @return {String} 字符串
 *
 * @example formatTime('2020/11/04 00:00:00', 'yyyy-MM-dd') // -> 2020-11-04
 * @example formatTime('2020/11/04 00:00:00', 'yyyy-MM-dd hh:mm:ss') // -> 2020-11-04 00:00:00
 */
function formatTime(val, format) {
  if (val) {
    /**
        * @instructions 如果不是时间戳格式，且含有字符 '-' 则将 '-' 替换成 '/' && 删除小数点及后面的数字
        * @reason 将 '-' 替换成 '/' && 删除小数点及后面的数字 的原因是safari浏览器仅支持 '/' 隔开的时间格式
        */
    if (val.toString().indexOf('-') > 0) {
      val = val.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/'); // 将 '-' 替换成 '/'
    }
    const REGEX = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    let date = new Date(val);
    date.setHours(date.getHours() + 8);
    const [yy, MM, dd, hh, mm, ss] = date.toISOString().match(REGEX);
    if (format) {
      return format
        .replace('yyyy', yy)
        .replace('yy', yy.slice(2))
        .replace('MM', MM)
        .replace('dd', dd)
        .replace('hh', hh)
        .replace('mm', mm)
        .replace('ss', ss);
    } else {
      return [yy, MM, dd].join('-') + ' ' + [hh, mm, ss].join(':');
    }
  } else {
    return '--';
  }
};