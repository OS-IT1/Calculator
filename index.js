const screen = document.getElementById("Screen");
let ans = 0;
let isOn = true;

function toDisplay(value) {
    if (!isOn) return;
    if (value === 'π') {
        screen.value += 'π'; 
    }
    else if (value === 'del') {
        if (screen.value.slice(-3) === "Ans") {
            screen.value = screen.value.slice(0, -3);
        } else {
            screen.value = screen.value.slice(0, -1);
        }
    }
    else if (value === 'Ans') {
        screen.value += 'Ans'; 
    }
    else {
        screen.value += value;
    }
    scrollToRight();
}

function calculate() {
    if (!isOn) return;
    try {
        let expression = screen.value.replace(/x/g, '*');
        expression = expression.replace(/Ans/g, ans);
        
        screen.value = evaluate(expression);
        if (screen.value !== 'Error') {
            ans = screen.value;
        }
    } catch (error) {
        screen.value = "Error";
    }
    scrollToLeft();
}

function clearScreen() {
    if (!isOn) return;
    screen.value = "";
}

function on() {
    document.querySelector('.on').classList.add('active');
    document.querySelector('.off').classList.remove('active');
    if(isOn)return;
    isOn = true;
    screen.value = "";
}

function off() {
    document.querySelector('.off').classList.add('active');
    document.querySelector('.on').classList.remove('active');
    if(!isOn)return;
    isOn = false;
    screen.value = "OFF";
    setTimeout(() => {
        screen.value = "";
    }, 1000);
}

function scrollToRight() {
    screen.scrollLeft = screen.scrollWidth;
}

function scrollToLeft() {
    screen.scrollToRight = screen.scrollWidth;
}

function evaluate(expression) {
    try {
        const tokens = expression.match(/(\d+(\.\d+)?)|[\+\-\*\/\(\)]|π/g);
        if (!tokens) return "Error";

        const outputQueue = [];
        const operatorStack = [];
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };
        const associativity = {
            '+': 'L',
            '-': 'L',
            '*': 'L',
            '/': 'L'
        };

        tokens.forEach(token => {
            if (token === 'π') {
                outputQueue.push(Math.PI);
            } 
            else if (token === '(') {
                operatorStack.push(token);
            } 
            else if (token === ')') {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            } 
            else if (!isNaN(parseFloat(token))) {
                outputQueue.push(token);
            }
            else {
                while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] && associativity[token] === 'L') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            }
        });

        while (operatorStack.length) {
            outputQueue.push(operatorStack.pop());
        }

        const stack = [];
        outputQueue.forEach(token => {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (token === Math.PI) {
                stack.push(Math.PI);  
            } else {
                const b = stack.pop();
                const a = stack.pop();
                if (a === undefined || b === undefined) {
                    throw new Error("Invalid expression");
                }
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                    default:
                        throw new Error("Unknown operator");
                }
            }
        });

        if (stack.length !== 1) {
            throw new Error("Invalid expression");
        }

        return stack[0];
    } catch (error) {
        return "Error";
    }
}
