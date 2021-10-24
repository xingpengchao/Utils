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