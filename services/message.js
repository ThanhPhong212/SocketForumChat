const moment = require('moment');

exports.formatMess = (user, msgContent) => {
  return {
    user,
    msgContent,
    time: moment().format('h:mm a'),
  };
};
