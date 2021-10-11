/**
 * @description: 身份证号脱敏显示
 * @param {String} code
 * @returns {String} 格式化后的身份证号
 */
function formatCode(code) {
  return `${code.substr(0,1)}*************${code.substr(17,18)}`;
}

/**
 * @description: 身份证号检验
 * @param {String} sId 身份证号
 * @returns {Boolean}
 */
function isCardID (sId) {
  sId = sId.toString();
  let iSum = 0;
  if (!/^\d{17}(\d|x)$/i.test(sId)) return false;
  sId = sId.replace(/x$/i, 'a');
  if (!fakeData.areacode[parseInt(sId.substr(0, 2))]) return false;
  let sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2));
  let d = new Date(sBirthday.replace(/-/g, '/'));
  if (sBirthday !== (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())) return false;
  for (let i = 17; i >= 0; i--) {
    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  };
  if (iSum % 11 !== 1) return false;
  return true;
}

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

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 * @returns {Void}
 */
function debounce (func, wait, immediate = true) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    }
    else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表示时间戳版，2 表示定时器版
 * @returns {Void}
 */
function throttle (func, wait, type) {
  let timeout;
  let previous = 0;
  return function () {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    }
    else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
}

