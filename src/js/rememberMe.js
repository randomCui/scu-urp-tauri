import fs from "fs"
export function saveLoginInfo(studentID, password) {
  let config = {}
  if (fs.existsSync('./config.json')) {
    let buffer = fs.readFileSync('./config.json');
    config = JSON.parse(buffer);
  }
  config['loginInfo'] = {
    'studentID': studentID,
    'password': password,
  }
  // console.log(process.cwd());
  fs.writeFile('./config.json', JSON.stringify(config), () => {
  });
}

export function readLoginInfo() {
  if (fs.existsSync('./config.json')) {
    let buffer = fs.readFileSync('./config.json');
    let config = JSON.parse(buffer);
    let studentID = config['loginInfo']['studentID'];
    let password = config['loginInfo']['password'];
    if (studentID && password)
      return {
        'status': 'success',
        'studentID': studentID,
        'password': password,
      }
    else
      return {
        'status': 'empty'
      }
  } else
    return {
      'status': 'not exist'
    }
}