import chalk from 'chalk'

function logger(color, label, message){
  if (!message){
    //console.log(color(label))
  }else{
    //console.log(color(label), message)
  }
}

export default {
  out(label, message){
    logger(chalk.white, label, message)
  },
  info(label, message){
    logger(chalk.cyan, label, message)
  },
  success(label, message){
    logger(chalk.green, label, message)
  },
  warn(label, message){
    logger(chalk.yellow, label, message)
  },
  fail(label, message){
    logger(chalk.red, label, message)
  }
}
