const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// starting values
let password = "";
let passwordLength = 10;
let checkCount = 1; // first checkbox is ticked

// set password length
let handleSlider = () => {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // color to be filled
    const min = inputSlider.min;
    const max = inputSlider.max;
    console.log(((passwordLength - min) * 100 / (max - min)) + "% 100%");
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
};

handleSlider();

let setIndicator = (color) => {
    // console.log(color);
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 0.5rem 0.5rem ${color}`;
};


function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0, 9);
}

function generateRandomLowercase(){
    return String.fromCharCode(getRndInteger(97, 123));
}

let generateRandomUppercase = () => {
    return String.fromCharCode(getRndInteger(65, 91));
}

let generateSymbols = () => {
    return symbols[getRndInteger(0, symbols.length)];
}

let calcStrength = () => {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && (password.length >= 8)){
        setIndicator('#0f0');
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && password.length >= 6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}


let copyContent = async () => {

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied!";
        copyMsg.style.scale = "1";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    setTimeout(() => {
        copyMsg.style = "scale: 0";
        copyMsg.innerHTML = "";
    }, 1500);
}


/***************** EVENT LISTENERS ********************/

// SLIDER 
inputSlider.addEventListener('input', (e) => {
    console.log(e.target.value);
    passwordLength = e.target.value;
    handleSlider();
});

// COPY BUTTON
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});


function shufflePassword (arr) {
    // FISHER YATE'S ALGORITHM

    // Start from the last element and swap
    // one by one. We don't need to run for
    // the first element that's why i > 0
    for(let i=arr.length-1; i>0; i--) {
        // Pick a random index from 0 to i inclusive
        let j = Math.floor(Math.random() * (i + 1));
 
        // Swap arr[i] with the element
        // at random index
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    let str = "";

    arr.forEach((element) => {
        str += element;
    })

    return str;
}

generateBtn.addEventListener('click', () => {
    // conditions
    if(passwordLength <= 0) return; // no password can be generated

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // password generation

    // first of all remove the old displaying password if any
    password = "";

    // create a function array as we want to decide randomly which function to call

    const funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateRandomUppercase);
    }

    if(lowercaseCheck.checked) {
        funcArr.push(generateRandomLowercase);
    }

    if(numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked) {
        funcArr.push(generateSymbols);
    }

    // first of all consider the checkboxes condition i.e. cumpulsory addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining letters
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randomIdx = getRndInteger(0, funcArr.length);
        password += funcArr[randomIdx]();
    }

    // now it is guaranteed that if uppercase is checked then first letter of the password will be a uppercase letter. This is not good so shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

});