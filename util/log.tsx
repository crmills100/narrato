var _log = "";

export function log(msg: String) {
  console.log(msg);
  _log += msg + "\n";
}

export function getLog() {
  return _log;
}    
