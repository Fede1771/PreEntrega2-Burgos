let precioProducto;
let productosDisponibles = [
  { nombre: "Manzanas", precio: 640 },
  { nombre: "Bananas", precio: 350 },
  { nombre: "Queso", precio: 25 },
  { nombre: "Pan", precio: 800 }
];

const calcularPrecioConIva = (precio, cantidad) => {
  const iva = 1.21;
  const precioSinIva = precio * cantidad;
  const precioConIva = precioSinIva * iva;
  return { precioSinIva, precioConIva };
}

const mostrarPrecio = (producto, precioConIva, precioSinIva, cantidad) => {
  alert(`Has seleccionado ${cantidad} kilos de ${producto}. \nEl precio total con IVA es: $${precioConIva.toFixed(2)} \nEl precio sin IVA es: $${precioSinIva.toFixed(2)}`);
}

let productoSeleccionado;

while (true) {
  let productosTexto = "Bienvenido al almacén ´Simona´ de tu barrio\n¿Qué vas a elegir hoy? Esto tenemos hoy en stock:\n";
  productosDisponibles.forEach((producto, index) => {
    productosTexto += `${index + 1}. ${producto.nombre}\n`;
  });
  productosTexto += "Si quiere salir de esta ventana por favor escriba CANCELAR";

  const userInput = prompt(productosTexto);

  if (userInput.toLowerCase() === "cancelar") {
    alert("Gracias por visitarnos. ¡Hasta luego!");
    break;
  }

  const selectedProductIndex = parseInt(userInput) - 1;
  const selectedProduct = productosDisponibles[selectedProductIndex];

  if (selectedProduct) {
    productoSeleccionado = selectedProduct.nombre;
    precioProducto = selectedProduct.precio;
    break;
  } else {
    alert("Selección no válida. Por favor, elige una opción válida.");
  }
}

if (productoSeleccionado !== "cancelar") {
  let cantidad;
  do {
    cantidad = parseFloat(prompt(`¿Cuántos kilos de ${productoSeleccionado} deseas comprar?`));

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Cantidad no válida. Debes ingresar una cantidad mayor que 0.");
    }
  } while (isNaN(cantidad) || cantidad <= 0);

  const { precioSinIva, precioConIva } = calcularPrecioConIva(precioProducto, cantidad);
  mostrarPrecio(productoSeleccionado, precioConIva, precioSinIva, cantidad);

  let confirmacion;
  do {
    confirmacion = prompt(
      `¿Desea comprar ${cantidad} kilos de ${productoSeleccionado} por $${precioProducto} por kilo con el IVA incluido? (Responda con 'si' o 'no')`
    );

    if (confirmacion.toLowerCase() !== "si" && confirmacion.toLowerCase() !== "no") {
      alert("Respuesta no válida. Debes responder con 'si' o 'no'.");
    }
  } while (confirmacion.toLowerCase() !== "si" && confirmacion.toLowerCase() !== "no");

  if (confirmacion.toLowerCase() === "si") {
    alert(`Has comprado ${cantidad} kilos de ${productoSeleccionado} por un total de $${precioConIva.toFixed(2)} con IVA incluido.\n ¡Gracias por tu compra!`);
  } else if (confirmacion.toLowerCase() === "no") {
    alert("Decidiste no comprar, serás dirigido a la ventana principal.");
  }
}

