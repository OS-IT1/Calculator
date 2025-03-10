const screen =document.getElementById("Screen")
let ans=0;

function toDisplay(value){
    if (value === 'π'){
        screen.value+= 'π';
    }
    else if(value === 'del'){
        screen.value = screen.value.slice(0,-1);
    }
    else if(value === ans){
        screen.value += 'Ans';
    }
    else{
        screen.value +=value;
    }
    scrollToRight();
}

function calculate(){
    try {
        let expression = screen.value.replace(/π/g, 'Math.PI');
        expression = expression.replace(/x/g, '*');
        expression = expression.replace(/log/g, 'Math.log10');
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/√/g, 'Math.sqrt');
        expression = expression.replace(/Ans/g, ans);
        screen.value = evaluate(expression);
        if(screen.value !== 'Error'){
            ans = screen.value;
        }
    } catch (error) {
        screen.value = "Error";
    }
    scrollToLeft();
}

function clearScreen(){
    screen.value= "";
}

function scrollToRight(){
    screen.scrollLeft = screen.scrollWidth;
}

function scrollToLeft(){
    screen.scrollToRight=screen.scrollWidth;
}

function calculate(){
    try {
        let expression = screen.value.replace(/π/g, 'Math.PI');
        expression = expression.replace(/x/g, '*');
        expression = expression.replace(/log/g, 'Math.log10');
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/√/g, 'Math.sqrt');
        expression = expression.replace(/Ans/g, ans);
        screen.value = evaluate(expression);
        if(screen.value !== 'Error'){
            ans = screen.value;
        }
    } catch (error) {
        screen.value = "Error";
    }
    scrollToLeft();
}

function evaluate(expression){
    try {
        const tokens = expression.match(/(\d+(\.\d+)?)|[\+\-\*\/\^\(\)π]|Math\.\w+\(/g);
        if (!tokens) return "Error";

        const outputQueue = []; 
        const operatorStack = [];
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
            '^': 3,
            'Math.sqrt(': 4,
            'Math.log10(': 4
        };
        const associativity = {
            '+': 'L',
            '-': 'L',
            '*': 'L',
            '/': 'L',
            '^': 'R',
            'Math.sqrt(': 'R',
            'Math.log10(': 'R'
        };

        tokens.forEach(token => {
            if (!isNaN(parseFloat(token))) {
                outputQueue.push(token);
            } else if (token === 'π') {
                outputQueue.push(Math.PI);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            } else {
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
                    case '^':
                        stack.push(Math.pow(a, b));
                        break;
                    case 'Math.sqrt(':
                        stack.push(Math.sqrt(b));
                        break;
                    case 'Math.log10(':
                        stack.push(Math.log10(b));
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