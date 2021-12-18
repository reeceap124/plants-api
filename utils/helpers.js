module.exports = {
  errorMsg
};

function errorMsg(error, msg, rtn = null) {
  console.error(msg, { message: error.message, error });
  return rtn;
}
