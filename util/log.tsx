var _log = "";

export function log(msg: String) {
  console.log(msg);
  _log += msg + "\n";
}

export function error(msg: String, error: any) {
  console.error(msg, error);
  _log += "ERROR: " + msg + " " + error + "\n";
}

export function warn(msg: String) {
  console.error(msg);
  _log += "WARN: " + msg + "\n";
}

export function getLog() {
  return _log;
}    

export function clearLog() {
  return _log = "";
}    
