// 1. LAS TECLAS SON PULSADAS CON EL RATÓN

// obtiene keys del DOM
const nameIdKeys = ["message", "display", "keyAC", "keyBack", "keyEqual", "keyLeftParenth", "keyRightParenth", "keyAdd", "keySubt", "keyDiv", "keyMult", "keyDot", "key0", "key1", "key2",  "key3", "key4", "key5", "key6", "key7", "key8", "key9", "back-arrow"]

const keys = [];
nameIdKeys.forEach(key => keys.push(document.getElementById(key)))

const keysCanBeDisplayed = keys.slice(5, 22) //se pueden mostrar por pantalla
const keysCannotBeDisplayed = keys.slice(0, 5) //solo se puede operar con ellas

//guardar en una variable separada las teclas especiales
const message = keys[nameIdKeys.indexOf("message")]
let display = keys[nameIdKeys.indexOf("display")]
const keyAC = keys[nameIdKeys.indexOf("keyAC")]
const keyBack = keys[nameIdKeys.indexOf("keyBack")]
const keyEqual = keys[nameIdKeys.indexOf("keyEqual")]
const keyDot = keys[nameIdKeys.indexOf("keyDot")]
let backArrow = document.getElementById("back-arrow");

//función que multiplica
function multiplication(mathExpression) {
  for(let i in mathExpression) {
    if(mathExpression[i] === "*") {
      let index = mathExpression.indexOf("*")
      let num1 = parseFloat(mathExpression[index-1])
      let num2 = parseFloat(mathExpression[index+1])
      let result = num1 * num2
      mathExpression.splice(index-1, 3, result)
    }
  }
}
//función que divide
function division(mathExpression) {
  for(let i in mathExpression) {
    if(mathExpression[i] === "/") {
      let index = mathExpression.indexOf("/")
      let num1 = parseFloat(mathExpression[index-1])
      let num2 = parseFloat(mathExpression[index+1])
      console.log("num2", num2)
      let result = num1 / num2
      mathExpression.splice(index-1, 3, result)
    }
  }
}
//función que suma
function addition(mathExpression) {
  for(let i in mathExpression) {
    if(mathExpression[i] === "+") {
      let index = mathExpression.indexOf("+")
      let num1 = parseFloat(mathExpression[index-1])
      let num2 = parseFloat(mathExpression[index+1])
      let result = num1 + num2
      mathExpression.splice(index-1, 3, result)
    }
  }
}
//función que resta
function subtraction(mathExpression) {
  for(let i in mathExpression) {
    if(mathExpression[i] === "-") {
      let index = mathExpression.indexOf("-")
      let num1 = parseFloat(mathExpression[index-1])
      let num2 = parseFloat(mathExpression[index+1])
      let result = num1 - num2
      mathExpression.splice(index-1, 3, result)
    }
  }
}

//Añade a un array todos los indices de cuando aparece el simbolo "("
let parentIni = []


function getIndexparenthesis(mathExpression) {
  for(let i in mathExpression) {
    if(mathExpression[i] === "(") {
      parentIni.push(i)
    }
  }
}

//función que opera una sola expresión, ya sea porque se encuentra dentro de un paréntesis, o porque no tiene paréntesis, llama a las funciones de suma, resta, división y multiplicación para que se ejecuten según el orden de prioridad.
function calculateOneExpression(mathExpression) {
  for(let i in mathExpression) {
    let indexAdd = mathExpression.indexOf("+")
    let indexSub = mathExpression.indexOf("-")
    let indexDiv = mathExpression.indexOf("/")
    let indexMult = mathExpression.indexOf("*")
    if(indexDiv < indexMult) {
      division(mathExpression)
      multiplication(mathExpression)
    } else if(indexDiv > indexMult) {
      multiplication(mathExpression)
      division(mathExpression)
    }
    if(indexAdd < indexSub) {
      addition(mathExpression)
      subtraction(mathExpression)
    } else if (indexAdd > indexSub) {
      subtraction(mathExpression)
      addition(mathExpression)
    }
  }
  return mathExpression
}

//función que separa cada operación por paréntesis y opera primero dentro de cada uno, del más interior al más exterior, teniendo en cuenta el orden de prioridad, hasta que al final únicamente queda un número: el resultado.
function calculateAllExpressions(mathExpression) {
  getIndexparenthesis(mathExpression)
  for(let i = parentIni.length-1; i >= 0; i--) {
    let indexIni = parseFloat(parentIni[i])
    let trimExpression = mathExpression.slice(indexIni, mathExpression.length)
    let parcialIndexLast = trimExpression.indexOf(")")
    let indexLast =indexIni + parcialIndexLast
    let parenthesisExpression = mathExpression.slice(indexIni+1, indexLast)
    let result = (calculateOneExpression(parenthesisExpression).toString())
    mathExpression.splice(indexIni, parcialIndexLast+1, result)
  }
  if(mathExpression.length > 1) {
    calculateOneExpression(mathExpression)
  }
  parentIni = []; //reset array que contiene los indices de los parentesis
  return parseInt(mathExpression)
}


//comprueba si la expresión matemática está bien formulada, si está bien formulada, mostrará el resultado, sino mostrará un mensaje de error
function validateExpression(finalResult) {
  if(isNaN(finalResult)) {
    message.style.fontSize = "2rem";
    message.innerHTML = "Malformed expression";
  } else {
    display.innerHTML = trimDecimals(finalResult); //si tiene decimales, max 10
    message.innerHTML = "Your result"
  }
}

// llama a la función que calcula las operaciones y muestra el resultado por pantalla además de un mensaje.
function calculate(mathOperation) {
  let finalResult = calculateAllExpressions(mathOperation)
  //let finalResult = eval(mathOperation); // EVAL, cuidado con string malicioso!!!
  validateExpression(finalResult)
}

// muestra la operación matemática por pantalla
function addKeyPressedToDisplay(event) {
  display.innerHTML += event.target.innerHTML
}

// si tiene decimales, muestra max 10, sino no muestra ninguno
function trimDecimals(num) {
  let numSplit = num.toString().split("")
  if(numSplit.includes(".")) {
    let index = numSplit.indexOf(".")
    let onlyDecimals = numSplit.slice(index+1, numSplit.length).join("")
    let maxDecimals = Math.min(onlyDecimals.length, 10)
    return num.toFixed(maxDecimals)
  } else {
    return num
  }
}

// resetea la calculadora para empezar una nueva operación
function reset() {
  keyAC.onclick = function() {
    display.innerHTML = "";
    message.innerHTML = "CALCULATOR";
    display.style.fontSize = "2.5rem";
  }
}

// borra el último número
function undo() {
  keyBack.onclick = function() {
    let splitLast = display.innerHTML.slice(0, -1)
    display.innerHTML = splitLast
    display.innerHTML.length > 0 ? message.innerHTML = "Typing..." : message.innerHTML = "CALCULATOR";
  }
}

//prepara la expresión introducida por el usuario para ser trabajada, haciendo que cada elemento, sea un elemento de un mismo array y no un simple string
function getMathExpression() {
  let onlyNumbersArray = (
    display.innerHTML
      .split("+").join(" + ")
      .split("-").join(" - ")
      .split("*").join(" * ")
      .split("/").join(" / ")
      .split("=").join(" = ")
      .split("(").join("( ")
      .split(")").join(" )")
      ).split(" ")
  return onlyNumbersArray
}

//ejecuta el funcionamiento principal de la calculadora
function runCalculator(key, event) {
  message.innerHTML = "Typing..." //mensaje que se muestra mientras opera
  addKeyPressedToDisplay(event) //muestra por pantalla la operación a realizar
  keyEqual.onclick = function() { //al clicar la tecla "="
    if(display.innerHTML.length < "15") { //si hay menos de 15 caracteres
      display.style.fontSize = "2.5rem"; //asegura el tamaño de la letra
    }
    let mathExpression = getMathExpression()
    calculate(mathExpression)
  }
}

// función principal que genera operaciones y las soluciona, mostrándolas por pantalla.
function addOnClickToKey(key) {
  reset() // calculadora a 0
  undo() // elimina el último carácter
  key.onclick = function(event) { // cada vez que se clique una tecla
    if(display.innerHTML.length < "15") { // si hay menos de 15 caracteres
      runCalculator(key, event) // ejecuta la calculadora
    }
    else if(display.innerHTML.length < "25") { // si hay entre 15 y 25 caract
      display.style.fontSize = "1.5rem"; // haz la letra mas pequeña
      runCalculator(key, event) // y ejecuta la calculadora
    }
  }
}

keys.slice(2, keys.length-1).forEach(addOnClickToKey) //por cada una de las teclas, menos message y display que no se pueden pulsar


// 2. LAS TECLAS SON PULSADAS CON EL TECLADO

// diccionarios de equivalencias de id de cada elemento con keyCode:
// estas teclas pueden ser mostradas por pantalla y se puede operar con ellas
const keysCanBeShown = {
  '48': 'key0', '96': 'key0',
  '49': 'key1', '97': 'key1',
  '50': 'key2', '98': 'key2',
  '51': 'key3', '99': 'key3',
  '52': 'key4', '100': 'key4',
  '53': 'key5', '101': 'key5',
  '54': 'key6', '102': 'key6',
  '55': 'key7', '103': 'key7',
  '56': 'key8', '104': 'key8',
  '57': 'key9', '105': 'key9',
  '110': 'keyDot', '190': 'keyDot',
  '107': 'keyAdd', '187': 'keyAdd',
  '109': 'keySubt', '189': 'keySubt',
  '106': 'keyMult',
  '111': 'keyDiv',
}

// estas teclas no pueden ser mostradas por pantalla, solo operar con ellas
const keysCannotBeShown = {
  '8': 'keyBack',
  '32': 'keyAC',
  '13': 'keyEqual',
}
// enter con shift y sin shift
const keyEqualKeyboard = {
  '13': 'keyEqual',
}

//caracteres que se activan apretando shift que se pueden mostrar por pantalla
const keysWithShiftCanBeShown = { // keyCode = 16 +
  '56': 'keyLeftParenth',
  '57': 'keyRightParenth',
  '55': 'keyDiv',
  '187': 'keyMult',
}
//caracteres que se activan apretando shift que no se pueden mostrar
const keysWithShiftCannotBeShown = { // keyCode = 16 +
  '48': 'keyEqual',
}

// función que cambia el estilo de la calculadora (color y tamaño letra)
function changeKeyboardStyle(key) {
  key.style.backgroundColor = "white"
  key.style.fontSize = "2.5rem";
  if(event.keyCode === 8) { //para hacer la flecha grande al pulsar atrás
    backArrow.style.width = "52px";
  }
}

//función que muestra por pantalla cada tecla que se pulsa que forme parte de la operación
function displayKeyboardNumbers(num) {
  message.innerHTML = "Typing..." // mensaje mostrado mientras se pulsan teclas
  if(display.innerHTML.length < "15") { //si hay menos de 15 carácteres
    display.innerHTML += num.innerHTML // muestra la expresión por pantalla
  } else if(display.innerHTML.length < "25") { //si hay entre 15 y 25
      display.style.fontSize = "1.5rem"; //reduce el tamaño de la letra
      display.innerHTML += num.innerHTML // muestra la expresión por pantalla
  }
}

//resetea la calculadora para empezar una nueva operación
function resetKeyboard() {
  if(event.keyCode === 32) { // se resetea en el espacio
    display.innerHTML = "";
    message.innerHTML = "CALCULATOR";
    display.style.fontSize = "2.5rem"; // asegura que vuelva al tamaño inicial
  }
}

//borra el último número
function undoKeyboard() {
  if(event.keyCode === 8) {
    let splitLast = display.innerHTML.slice(0, -1)
    display.innerHTML = splitLast
    display.innerHTML.length > 0
      ? message.innerHTML = "Typing..."
      : message.innerHTML = "CALCULATOR";
  }
}

// función que muestra el resultado de la operación por pantalla cuando se solicita pulsando la tecla enter
function showKeyboardResult(event) {
  if(event.keyCode === 13 || (shiftIsPressed && event.keyCode === 48)) { //si se pulsa el enter, "="
    if(display.innerHTML.length < "15") { //si ahora hay menos de 15
      display.style.fontSize = "2.5rem"; // vuelve a poner el tamaño inicial
    }
    validateExpression()
    let mathExpression = getMathExpression()
    calculate(mathExpression)
  }
}

//relaciona cada pulsacion de tecla con su correspondencia en el DOM
function getDomKeys(event, diccionary) {
  let nameKeys = diccionary[event.keyCode]
  let keyDomKeys = keys[nameIdKeys.indexOf(nameKeys)]
  return keyDomKeys
}

// funcion que se encarga de distinguir si las teclas pueden mostrarse o no por pantalla, avisar si se ha cometido algún error al escribir, y cambiar el estilo cuando sean pulsadas
let shiftIsPressed = false;
function changeStyleAndDisplayNumbers(event) {
  if (event.keyCode === 16) { //si se pulsa shift
    shiftIsPressed = true;
  }
  if(shiftIsPressed && event.keyCode !== 16 && event.keyCode !== 48) { //segunda tecla con shift
    let keyDomShiftKeys = getDomKeys(event, keysWithShiftCanBeShown)
    changeKeyboardStyle(keyDomShiftKeys)
    displayKeyboardNumbers(keyDomShiftKeys)
  } else if(shiftIsPressed && event.keyCode === 48) {//tecla = con shift
    let keyDomShiftKeysNoShown = getDomKeys(event, keysWithShiftCannotBeShown)
    changeKeyboardStyle(keyDomShiftKeysNoShown)
  }
  else { //teclas simples, sin shift
    if(keysCanBeShown[event.keyCode]) {
    //if(Object.keys(keysCanBeShown).includes(event.keyCode.toString())) {
      let keyDomCanBeShown = getDomKeys(event, keysCanBeShown)
      changeKeyboardStyle(keyDomCanBeShown)
      displayKeyboardNumbers(keyDomCanBeShown)
    } else if(keysCannotBeShown[event.keyCode]) {
      let keyDomCannotBeShown = getDomKeys(event, keysCannotBeShown)
      changeKeyboardStyle(keyDomCannotBeShown)
    }
  }
}

//función princial que ejecuta el código cuando se pulsan las teclas
addEventListener("keydown", function(event) {
  resetKeyboard();
  undoKeyboard();
  changeStyleAndDisplayNumbers(event);
  showKeyboardResult(event);
})

//cuando se levanta la tecla, se devuelve el estilo original
function resetKeyboardStyle(event, diccionary) {
  if(diccionary[event.keyCode]) {
    let keyDom = getDomKeys(event, diccionary)
    keyDom.style.backgroundColor = ""
    keyDom.style.fontSize = "";
  } else if(event.keyCode === 8) { //hacer la flecha pequeña al soltar tecla
    backArrow.style.width = "45px";
  }
}

//Cuando se deje de presionar la tecla, se volverá al color y tamaño inicial
addEventListener("keyup", function(event) {
  if(event.keyCode === 16) {
    shiftIsPressed = false;
  }
  resetKeyboardStyle(event, keysCanBeShown)
  resetKeyboardStyle(event, keysCannotBeShown)
  resetKeyboardStyle(event, keysWithShiftCanBeShown)
  resetKeyboardStyle(event, keysWithShiftCannotBeShown)
});




// ------------------------------------------------------------------

//Muestra por pantalla qué tecla se está pulsando a cada momento
/*
function onKeyDownHandler(event) {
    var codigo = event.which || event.keyCode;
    console.log("Presionada: " + codigo);
    if(codigo === 13){
      console.log("Tecla ENTER");
    }
    if(codigo >= 65 && codigo <= 90){
      console.log(String.fromCharCode(codigo));
    }
}

// <!--<input onkeydown="onKeyDownHandler(event);"/>-->
*/


/*Ejemplo de keydown y de keyup
addEventListener("keydown", function(event) {
    if(event.keyCode == 49)
    displayKeyboardNumbers(num1)
  });


addEventListener("keyup", function(event) {
  if (event.keyCode == 86)
    document.body.style.background = "";
});
*/


