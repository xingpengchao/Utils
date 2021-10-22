/**
 * @desc 身份证脱敏显示
 * @param {String} code
 * @returns {String} 格式化后的身份证
 */
function formatCode(code) {
  return `${code.substr(0,1)}*************${code.substr(17,18)}`;
}