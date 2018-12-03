const path = require('path');

module.exports = function loadFolioConfig() {
  return require(path.join(process.cwd(), 'folio.config.js'));
};
