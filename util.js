/**
 * @desc 身份证脱敏显示
 * @param {String} code
 * @returns {String} 格式化后的身份证
 */
function formatCode(code) {
  return `${code.substr(0,1)}*************${code.substr(17,18)}`;
}

/**
 * @desc 身份证检验
 * @param {String} sId 身份证
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

/* web存储封装 */
class StorageFn {
  constructor () {
      this.ls = window.localStorage;
      this.ss = window.sessionStorage;
  }


  /*-----------------cookie---------------------*/
  /*设置cookie*/
  setCookie (name, value, day) {
      let setting = arguments[0];
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
          for (let i in setting) {
              let oDate = new Date();
              oDate.setDate(oDate.getDate() + day);
              document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
          }
      }else{
          let oDate = new Date();
          oDate.setDate(oDate.getDate() + day);
          document.cookie = name + '=' + value + ';expires=' + oDate;
      }
  }

  /*获取cookie*/
  getCookie (name) {
      const arr = document.cookie.split('; ');
      for (let i = 0; i < arr.length; i++) {
          const arr2 = arr[i].split('=');
          if (arr2[0] === name) {
              return arr2[1];
          }
      }
      return '';
  }

  /*删除cookie*/
  removeCookie (name) {
      this.setCookie(name, 1, -1);
  }


  /*-----------------localStorage---------------------*/
  /*设置localStorage*/
  setLocal(key, val) {
      let setting = arguments[0];
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
          for(let i in setting){
              this.ls.setItem(i, JSON.stringify(setting[i]))
          }
      }else{
          this.ls.setItem(key, JSON.stringify(val))
      }
  }

  /*获取localStorage*/
  getLocal(key) {
      if (key) return JSON.parse(this.ls.getItem(key))
      return null;
  }

  /*移除localStorage*/
  removeLocal(key) {
      this.ls.removeItem(key)
  }

  /*移除所有localStorage*/
  clearLocal() {
      this.ls.clear()
  }


  /*-----------------sessionStorage---------------------*/
  /*设置sessionStorage*/
  setSession(key, val) {
      let setting = arguments[0];
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
          for(let i in setting){
              this.ss.setItem(i, JSON.stringify(setting[i]))
          }
      }else{
          this.ss.setItem(key, JSON.stringify(val))
      }
  }

  /*获取sessionStorage*/
  getSession(key) {
      if (key) return JSON.parse(this.ss.getItem(key))
      return null;
  }

  /*移除sessionStorage*/
  removeSession(key) {
      this.ss.removeItem(key)
  }

  /*移除所有sessionStorage*/
  clearSession() {
      this.ss.clear()
  }
}

/* 将数字转换为大写金额 */
function changeToChinese (Num) {
  //判断如果传递进来的不是字符的话转换为字符
  if(typeof Num == "number") {
    Num = new String(Num);
  };
  Num = Num.replace(/,/g, "") //替换tomoney()中的“,”
  Num = Num.replace(/ /g, "") //替换tomoney()中的空格
  Num = Num.replace(/￥/g, "") //替换掉可能出现的￥字符
  if(isNaN(Num)) { //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return "";
  };
  //字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split(".");
  var newchar = "";
  //小数点前进行转化
  for(var i = part[0].length - 1; i >= 0; i--) {
      if(part[0].length > 10) {
          return "";
          //若数量超过拾亿单位，提示
      }
      var tmpnewchar = ""
      var perchar = part[0].charAt(i);
      switch(perchar) {
          case "0":
              tmpnewchar = "零" + tmpnewchar;
              break;
          case "1":
              tmpnewchar = "壹" + tmpnewchar;
              break;
          case "2":
              tmpnewchar = "贰" + tmpnewchar;
              break;
          case "3":
              tmpnewchar = "叁" + tmpnewchar;
              break;
          case "4":
              tmpnewchar = "肆" + tmpnewchar;
              break;
          case "5":
              tmpnewchar = "伍" + tmpnewchar;
              break;
          case "6":
              tmpnewchar = "陆" + tmpnewchar;
              break;
          case "7":
              tmpnewchar = "柒" + tmpnewchar;
              break;
          case "8":
              tmpnewchar = "捌" + tmpnewchar;
              break;
          case "9":
              tmpnewchar = "玖" + tmpnewchar;
              break;
      }
      switch(part[0].length - i - 1) {
          case 0:
              tmpnewchar = tmpnewchar + "元";
              break;
          case 1:
              if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
              break;
          case 2:
              if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
              break;
          case 3:
              if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
              break;
          case 4:
              tmpnewchar = tmpnewchar + "万";
              break;
          case 5:
              if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
              break;
          case 6:
              if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
              break;
          case 7:
              if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
              break;
          case 8:
              tmpnewchar = tmpnewchar + "亿";
              break;
          case 9:
              tmpnewchar = tmpnewchar + "拾";
              break;
      }
      newchar = tmpnewchar + newchar;
  }
  //小数点之后进行转化
  if(Num.indexOf(".") != -1) {
    if(part[1].length > 2) {
      // alert("小数点之后只能保留两位,系统将自动截断");
      part[1] = part[1].substr(0, 2)
    }
    for(i = 0; i < part[1].length; i++) {
      tmpnewchar = ""
      perchar = part[1].charAt(i)
      switch(perchar) {
        case "0":
          tmpnewchar = "零" + tmpnewchar;
          break;
        case "1":
          tmpnewchar = "壹" + tmpnewchar;
          break;
        case "2":
          tmpnewchar = "贰" + tmpnewchar;
          break;
        case "3":
          tmpnewchar = "叁" + tmpnewchar;
          break;
        case "4":
          tmpnewchar = "肆" + tmpnewchar;
          break;
        case "5":
          tmpnewchar = "伍" + tmpnewchar;
          break;
        case "6":
          tmpnewchar = "陆" + tmpnewchar;
          break;
        case "7":
          tmpnewchar = "柒" + tmpnewchar;
          break;
        case "8":
          tmpnewchar = "捌" + tmpnewchar;
          break;
        case "9":
          tmpnewchar = "玖" + tmpnewchar;
          break;
      }
      if(i == 0) tmpnewchar = tmpnewchar + "角";
      if(i == 1) tmpnewchar = tmpnewchar + "分";
      newchar = newchar + tmpnewchar;
    }
  }
  //替换所有无用汉字
  while(newchar.search("零零") != -1) {
    newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零元", "元");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if(newchar.charAt(newchar.length - 1) == "元") {
        newchar = newchar + "整"
    }
  }
  return newchar;
}

/* 判断是否为Ios */
function isIos() {
  const ua = navigator.userAgent;
  const isIos = (ua.indexOf('iPhone') != -1) || (ua.indexOf('iPad') != -1);
  return isIos
}

/* 判断是否为PC端 */
function isPC () {
  const userAgentInfo = navigator.userAgent;
  const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
      }
  }
  return flag;
}

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

/* 获取全部url参数,并转换成json对象 */
function getUrlAllParams (url) {
  let _url = url ? url : window.location.href;
  let _pa = _url.substring(_url.indexOf('?') + 1),
    _arrS = _pa.split('&'),
    _rs = {};
  for (let i = 0, _len = _arrS.length; i < _len; i++) {
    let pos = _arrS[i].indexOf('=');
    if (pos == -1) {
        continue;
    }
    let name = _arrS[i].substring(0, pos),
        value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
    _rs[name] = value;
  }
  return _rs;
}

/* 深拷贝 */
const deepClone = (target, cache = new Map()) => {
  const isObject = obj => typeof obj === 'object' && obj !== null

  if (isObject(target)) {
    // 解决循环引用
    const cacheTarget = cache.get(target)
    // 已经存在直接返回，无需再次解析
    if (cacheTarget) {
      return cacheTarget
    }

    let cloneTarget = Array.isArray(target) ? [] : {}

    cache.set(target, cloneTarget)

    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        const value = target[ key ]
        cloneTarget[ key ] = isObject(value) ? deepClone(value, cache) : value
      }
    }

    return cloneTarget
  } else {
    return target
  }
}

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

/* HTML标签反转义 */
const escape2Html = str => {
  const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'quot': '"', 'amp': '' };
  return str.replace(/&(amp|lt|gt|nbsp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
}