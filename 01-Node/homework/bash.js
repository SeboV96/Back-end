const commands = require('./commands/index.js');
const print = (output) => {
  process.stdout.write(output)
  process.stdout.write('\nprompt > ')
}

// Output un prompt
process.stdout.write('prompt > ');

process.stdin.on('data', (data) => {

  let args = data.toString().trim().split(" ")

  let cmd = args.shift()

  if(commands[cmd]){
    commands[cmd](args, print)
  }else{
    print('cmd not found')
  }

})