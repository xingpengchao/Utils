/* HTML标签反转义 */
const escape2Html = str => {
  const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'quot': '"', 'amp': '' };
  return str.replace(/&(amp|lt|gt|nbsp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
}