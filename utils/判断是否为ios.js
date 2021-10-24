/* 判断是否为Ios */
function isIos() {
  const ua = navigator.userAgent;
  const isIos = (ua.indexOf('iPhone') != -1) || (ua.indexOf('iPad') != -1);
  return isIos
}