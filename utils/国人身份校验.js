/**
 * @description: 真实姓名检验，支持中文2~15位，包含新疆人姓名，比如迪丽热巴·迪力木拉提
 * @param {String} name 姓名
 * @returns {Boolean}
 */
function isChineseName (name) {
  name = name.toString();
  if (! /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,15}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,15}$))/.test(name)) return false;
  return true;
}
