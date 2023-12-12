// Función que muestra las opciones de operaciones disponibles
function mostrarOpciones() {
  console.log("Opciones:");
  console.log("1- Suma");
  console.log("2- Resta");
  console.log("3- Multiplicación");
  console.log("4- División");
  console.log("5- Salir");
}

// Función suma
function suma(a, b) {
  return a + b;
}

// Función resta
function resta(a, b) {
  return a - b;
}

// Función multiplicación
function multiplicacion(a, b) {
  return a * b;
}

// Función división
function division(a, b) {
  if (b !== 0) {
      return a / b;
  } else {
      console.log("Error: No se puede dividir por cero.");
      return NaN;
  }
}

// Función principal calculadora
function calculadora() {
  let opcion = 0;

  while (opcion !== 5) {
      mostrarOpciones();
      opcion = parseInt(prompt("Selecciona una opción: (ver consola)"));

      if (opcion >= 1 && opcion <= 4) {
          const num1 = parseFloat(prompt("Ingresa el primer número:"));
          const num2 = parseFloat(prompt("Ingresa el segundo número:"));
          let resultado = 0;

          switch (opcion) {
              case 1:
                  resultado = suma(num1, num2);
                  break;
              case 2:
                  resultado = resta(num1, num2);
                  break;
              case 3:
                  resultado = multiplicacion(num1, num2);
                  break;
              case 4:
                  resultado = division(num1, num2);
                  break;
          }

          console.log("El resultado es:", resultado);
      } else if (opcion !== 5) {
          console.log("Opción inválida. Por favor, selecciona una opción válida.");
      }
  }

  console.log("Calculadora finalizada.");
}

// Llamada a la función calculadora
calculadora();