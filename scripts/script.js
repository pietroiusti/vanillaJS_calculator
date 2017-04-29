"use strict";
window.onload = function () {

    var totalString = '0';
    var lastInput = '0';
    var entryScreen = '0';

    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var operators = ['/', '*', '+', '-'];

    var screenWidth = 350; //from ../styles/style.css
    var entryScreenTextSize = 50; //from ../styles/style.css

    var screen = document.getElementById('steps');

    //get final result turning totalString into its evaluation (without using eval)
    function getResult() {
        //            I cast to string in order to resize
        entryScreen = String(calculate(parseCalculationString(totalString)));
        totalString = String(calculate(parseCalculationString(totalString)));
    }
    //Update screen
    function update() {
        //put entryScreen into screen
        screen.innerHTML = entryScreen;

        // Resize entryScreen if it's too big for the screen
        // To do this I use the Range Object 
        // The insight comes from: http://stackoverflow.com/questions/16209153/how-to-get-the-position-and-size-of-a-html-text-node-using-javascript  
        var range = document.createRange(); 
        var textNode = screen.firstChild;
        range.selectNodeContents(textNode);
        var rects = range.getClientRects(); // Range.getClientRects is still an experimental API though. Alternatives?
        var entryScreenWidth = rects[0].width;
        console.log('the width of the text in the screen is: ' + entryScreenWidth + 'px');
        console.log('while the screen width is ' + screenWidth + 'px');

        if (entryScreenWidth > screenWidth-10) {
            while (entryScreenWidth > screenWidth-10) {
                entryScreenTextSize -= 2; 
                screen.setAttribute('style', 'font-size: ' + entryScreenTextSize + 'px');
                range.selectNodeContents(textNode);
                rects = range.getClientRects();
                entryScreenWidth = rects[0].width;
            }
        }

        //for debugging purposes
        console.log('entryScreen = ' + entryScreen);
        console.log( 'totalString = ' + totalString);
        console.log( 'lastInput = ' + lastInput);
    }

    // manage input received
    function getValue(input) {
        // if input is a number
        if (numbers.includes(input) === true) { 
            // if last input is a number or "."
            if (numbers.includes(lastInput) === true || lastInput === '.') {
                //overwrite the first zero if it is the first operation
                if (totalString === '0') {
                    totalString = input; 
                    entryScreen = input;
                    lastInput = input;
                    update();
                } else {
                    totalString += input; 
                    entryScreen += input;
                    lastInput = input;
                    update();
                }
            }
            // if last input is an operator
            else if (operators.includes(lastInput) === true) {
                totalString += input;
                entryScreen = input;
                //bring to normal font-size (since we are starting again from one digit)
                entryScreenTextSize = 50;
                screen.setAttribute('style', 'font-size: ' + entryScreenTextSize + 'px');
                lastInput = input;
                update();
            }
            // if last input was equal sign
            else if (lastInput === '=') {
                totalString = input; 
                entryScreen = input;
                lastInput = input;
                update();
            }
            // if last input was AC
            else if (lastInput === 'AC') {
                totalString = input; 
                entryScreen = input;
                lastInput = input;
                update();
            }
        }
        // if input is "."
        else if (input === '.') {
            // if last input was a number
            if (numbers.includes(lastInput) === true) {
                totalString += input;
                entryScreen += input;
                lastInput = input;
                update();
            }
            //if last it input is '.'
            else if (lastInput === '.') {
                ;//do nothing
            }
            // if last input was an operator
            else if (operators.includes(lastInput) === true) {
                ;//do  nothing
            }
            // if last input was equal sign
            else if (lastInput === '=') {
                ;//do nothing
            }
            // if last input was AC
            else if (lastInput === 'AC') {
                //in this case totalString and entryScren would be equal to "0"
                //so we put the dot after the 0
                totalString += input; 
                entryScreen += input;
                lastInput = input;
                update();
            }
        }
        // if input is an operator
        else if (operators.includes(input) === true) {
            // if last input was a number
            if (numbers.includes(lastInput) === true) {
                //show result of previous calculation
                getResult(); 
                
                totalString += input;
                lastInput = input;
                update();
            }
            // if last input was '.'
            if (lastInput === '.') {
                ;//do nothing
            }
            // if last input was an operator
            else if (operators.includes(lastInput) === true) {
                ;//do nothing
            }
            // if last input was equal sign
            else if (lastInput === '=') {
                //use last results as first entry
                totalString += input;
                lastInput = input;
            }
            // if last input was AC
            else if (lastInput === 'AC') {
                totalString += input;
                lastInput = input;
                update();
            }
        }
        // if input is equal sign
        else if (input === '=') {
            // if last input was a number
            if (numbers.includes(lastInput) === true) {
                getResult();
                lastInput = input;
                update();
            }
            //if last it input is '.'
            else if (lastInput === '.') {
                ;//do nothing
            }
            // if last input was an operator
            else if (operators.includes(lastInput) === true) {
                ;//do  nothing
            }
            // if last input was equal sign
            else if (lastInput === '=') {
                ;//do nothing
            }
            // if last input was AC
            else if (lastInput === 'AC') {
                ;//do nothing
            }
        }
        // if input is AC
        else if (input === 'AC') {
            totalString = '0';
            //bring to normal font size
            entryScreenTextSize = 50;
            screen.setAttribute('style', 'font-size: ' + entryScreenTextSize + 'px');
            entryScreen = '0';
            lastInput = input;
            update();
        }
        // if input is CE
        else if (input === 'CE') {
            // if last input was a number
            if (numbers.includes(lastInput) === true || lastInput === '.') {

                // turn screen into "0" and bring to normal font-size
                entryScreenTextSize = 50;
                screen.setAttribute('style', 'font-size: ' + entryScreenTextSize + 'px');
                entryScreen = '0';
                update();

                // cut last entry from totalString
                var indexes = operators.map(function(operator) {
                    return totalString.lastIndexOf(operator);
                });
                var lastOperatorIndex = Math.max.apply(null, indexes);
                totalString = totalString.slice(0, lastOperatorIndex+1);
                console.log(totalString);

                //set lastInput to last char in the totalString
                lastInput = totalString[totalString.length-1];
                
            }
            // if last input was an operator
            else if (operators.includes(lastInput) === true) {
                ;//do  nothing

                // I could allow to remove the last operator in the totalString
            }
            // if last input was equal sign
            else if (lastInput === '=') {
                ;//do nothing
            }
            // if last input was AC
            else if (lastInput === 'AC') {
                ;//do nothing
            }
        }
    }

    //call getValue with the right arg when a button is clicked
    //(I use an IIFE to not pollute the scope)
    (function () {    
        var buttons = document.getElementsByClassName('button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function whenclicked(){
                console.log(this.id);
                getValue(this.id);
            });
        }
    })();
    //Do the same when a key is pressed
    window.addEventListener('keydown', function(event) {
        if (event.key === 'a') {
            event.preventDefault(); //prevent the key to do something else
            getValue('AC');
        } else if (event.key === 'e') {
            event.preventDefault();
            getValue('CE'); 
        }else if (event.key === '/') { 
            event.preventDefault(); 
            getValue(event.key);
        } else if (event.key === 'Enter') { // Make Enter act as '='
            event.preventDefault();
            getValue('=');
        } else {
            console.log(event);
            getValue(event.key);
        }
    });
//----------------------------------------------------------------------------------------------   
//Code to avoid using eval; taken from:
//http://stackoverflow.com/questions/32292231/how-to-code-a-calculator-in-javascript-without-eval
    function parseCalculationString(s) {
    // --- Parse a calculation string into an array of numbers and operators
    var calculation = [],
        current = '';
    for (var i = 0, ch; ch = s.charAt(i); i++) {
        if ('^*/+-'.indexOf(ch) > -1) {
            if (current == '' && ch == '-') {
                current = '-';
            } else {
                calculation.push(new Decimal(current), ch);
                current = '';
            }
        } else {
            current += s.charAt(i);
        }
    }
    if (current != '') {
        calculation.push(new Decimal(current));
    }
    return calculation;
}

function calculate(calc) {
    // --- Perform a calculation expressed as an array of operators and numbers
    var ops = [{'^': (a, b) => a.pow(b)},
    	{'*': (a, b) => a.mul(b), '/': (a, b) => a.div(b)},
        {'+': (a, b) => a.add(b), '-': (a, b) => a.sub(b)}],
        newCalc = [],
        currentOp;
    for (var i = 0; i < ops.length; i++) {
        for (var j = 0; j < calc.length; j++) {
            if (ops[i][calc[j]]) {
                currentOp = ops[i][calc[j]];
            } else if (currentOp) {
                newCalc[newCalc.length - 1] = currentOp(newCalc[newCalc.length - 1], calc[j]);
                currentOp = null;
            } else {
                newCalc.push(calc[j]);
            }
        }
        calc = newCalc;
        newCalc = [];
    }
    if (calc.length > 1) {
        console.log('Error: unable to resolve calculation');
        return calc;
    } else {
        return calc[0];
    }
}
//end of code take from stackoverflow
//---------------------------------------------------------------------------------------------

};
