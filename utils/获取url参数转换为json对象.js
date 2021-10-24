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
