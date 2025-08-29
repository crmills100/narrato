var _log = "";

export function log(msg: String) {
  _log += msg + "\n";
}

export function getLog() {
  return _log;
}    
