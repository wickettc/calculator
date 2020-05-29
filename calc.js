const buttons = document.querySelectorAll('button');
const display = document.querySelector('.display');
const chainDisplay = document.querySelector('.chain-display');
const equalBtn = document.querySelector('.equal');
const decimalBtn = document.querySelector('.decimal');
let operator = '';
let firstVal;
equalBtn.disabled = true;
chainDisplay.textContent = '';

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const operate = (a, b, func) => func(a, b);

// evaluate based off which operator
function evaluate(first, second, funct) {
        if (second === 0 && funct === 'divide') {
                return (display.textContent = 'You broke it..');
        }
        switch (funct) {
                case 'add':
                        return operate(first, second, add);
                case 'subtract':
                        return operate(first, second, subtract);
                case 'multiply':
                        return operate(first, second, multiply);
                case 'divide':
                        return operate(first, second, divide);

                default:
                        return (display.textContent = 'Uh..oh...');
        }
}

buttons.forEach(button =>
        button.addEventListener('click', function(e) {
                const { target } = e;
                // check if equal button should be enabled or disabled
                if (firstVal && operator && display.textContent) {
                        equalBtn.disabled = false;
                }
                // backspace functionality
                if (target.classList.contains('backspace')) {
                        const backspaced = display.textContent.slice(0, -1);
                        display.textContent = backspaced;
                        // checks if decimal is backspaced, if so the button will be enabled
                        if (display.textContent.includes('.')) {
                                decimalBtn.disabled = true;
                        } else {
                                decimalBtn.disabled = false;
                        }
                }
                if (target.classList.contains('number')) {
                        // check if decimal button has been used, and if has disable it
                        if (target.classList.contains('decimal')) {
                                decimalBtn.disabled = true;
                        }
                        // limits input length
                        if (display.textContent.length < 12) {
                                // either starts new display, or strings onto display
                                display.textContent === '0'
                                        ? (display.textContent = button.textContent)
                                        : (display.textContent += button.textContent);
                        }
                }
                if (target.classList.contains('operator')) {
                        // reset decimal button
                        decimalBtn.disabled = false;
                        // checks if operation should evaluate or not
                        if (chainDisplay.textContent) {
                                firstVal = evaluate(parseFloat(firstVal), parseFloat(display.textContent), operator);
                                chainDisplay.textContent = `${firstVal} ${target.textContent}`;
                                operator = target.dataset.info;
                                display.textContent = '0';
                        } else {
                                chainDisplay.textContent = `${display.textContent} ${target.textContent}`;
                                firstVal = display.textContent;
                                operator = target.dataset.info;
                                display.textContent = '0';
                        }
                }
                // clear button
                if (target.classList.contains('clear')) {
                        chainDisplay.textContent = '';
                        display.textContent = '0';
                        operator = '';
                        equalBtn.disabled = true;
                        decimalBtn.disabled = false;
                }
                // equal button
                if (target.classList.contains('equal')) {
                        firstVal = evaluate(parseFloat(firstVal), parseFloat(display.textContent), operator);
                        chainDisplay.textContent = '';
                        // checks if answer already has decimal place, if so disables decimal button
                        if (Math.floor(firstVal) === firstVal) {
                                decimalBtn.disabled = false;
                        } else {
                                decimalBtn.disabled = true;
                        }
                        // rounds final display to prevent overflow
                        // (unless you throw some massively crazy number in there)
                        if (firstVal > 120000000000) {
                                display.textContent = firstVal.toExponential();
                        } else {
                                display.textContent = Math.round(firstVal * 1000000000) / 1000000000;
                        }
                }
        })
);
