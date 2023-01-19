let common = require('./common');

let cmd = process.argv[2]

console.log("cmd:", cmd);

let log = console.log.bind(console)

switch (cmd){
  case 'html': 
    common.getHtml().then(log);
    break;
  case 'dom':
    common.getDOM().then(log)
    break;
  case 'data':
    common.getData().then(log);
    break;
}