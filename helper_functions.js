const minNum = 0;
const maxNum = 10;

function createQuestion(){
  const num1 = getRandomNumber(minNum,maxNum);
  const num2 = getRandomNumber(minNum,maxNum);
  const op = '*';
  const expression = `${num1} ${op} ${num2}`;
  
  return {
    expression: expression,
    answer: eval(expression)
  };
}

function getRandomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  createQuestion
}