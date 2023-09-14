const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("[#uppercase]");
const lowercaseCheck = document.querySelector("[#lowercase]");
const numbersCheck = document.querySelector("[#numbers]");
const symbolsCheck = document.querySelector("[#symbols]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+={[}]?>?:<,.>/|\/"';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
// set strength circle color to grey

//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
}

function getRandInteger(min,max){
    return Math.floor(Math.random() *(max-min) + min);
}

function generateRandom(){
    return getRandInteger(0,9);   
}

function generateLowerCase() {
    String.fromCharCode(getRandInteger(97,123));
}

function generateUpperCase() {
    String.fromCharCode(getRandInteger(65,90));
}

function generateSymbol() {
    const randNum = getRandInteger(0, symbols.length)
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0")
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) && 
        passwordLength >= 6
        ) {
            setIndicator("#ff0");
        } else {
            setIndicator("#f00");
        }
    }
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    });

    //special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //if no checkbox are selected
    if (checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //to find new password

    //1st remove existing password
    password ="";

    //lets cook password
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandom();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funArr.push(generateRandom);

    if(symbolsCheck.checked)
        funArr.push(generateSymbol);

    //compulsory addition
    for(i=0; i< funArr.length; i++){
        password += funArr[i]();
    }

    //remaining addtion
    for(let i= 0; i < passwordLength-funArr.length;i++){
        let randIndex = getRandInteger(0, funArr.length);
        password += funArr[randIndex];
    }
    
})