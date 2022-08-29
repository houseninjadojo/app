// import os from 'os';
const os = require('os');

const lanIP = () => {
  const iface = Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => !item.internal && item.family === 'IPv4')
    .find(Boolean);
  return iface.address;
};

module.exports = {
  lanIP,
};
