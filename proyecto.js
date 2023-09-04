let precioProducto;

// Función para calcular el precio con IVA
const calcularPrecioConIva = (precio, cantidad) => {
  const iva = 0.21;
  const precioSinIva = precio * cantidad;
  const precioConIva = precioSinIva * (1 + iva);
  return { precioSinIva, precioConIva };
}

// Función para mostrar el precio del producto con y sin IVA. Se pone tofixed para redondear
const mostrarPrecio = (producto, precioConIva, precioSinIva, cantidad) => {
  alert(`Has seleccionado ${cantidad} kilos de ${producto}. \nEl precio total con IVA es: $${precioConIva.toFixed(2)} \nEl precio sin IVA es: $${precioSinIva.toFixed(2)}`);
}

let productoSeleccionado;

while (true) {
  const producto = prompt(
    "Bienvenido al almacén ´Simona´ de tu barrio\n¿Qué vas a elegir hoy? Esto tenemos hoy en stock:\nManzanas\nBananas\nLeche\nPan\nSi quiere salir de esta ventana por favor escriba CANCELAR"
  );

  productoSeleccionado = producto.toLowerCase();

  if (productoSeleccionado === "cancelar") {
    alert("Gracias por visitarnos. ¡Hasta luego!");
    break;
  } else {
    switch (productoSeleccionado) {
      case "manzanas":
        precioProducto = 640; // Precio por kilogramo
        break;
      case "bananas":
        precioProducto = 350; // Precio por kilogramo
        break;
      case "queso":
        precioProducto = 25; // Precio por kilogramo
        break;
      case "pan":
        precioProducto = 800; // Precio por unidad
        break;
      default:
        alert("Producto no válido o no disponible. Por favor, elige una opción válida.");
        continue; // Vuelve al principio del bucle para volver a preguntar
    }
    // Si pasa esto significa que se ha seleccionado un producto válido
    break; // Salimos del bucle while
  }
}

if (productoSeleccionado !== "cancelar") {
  // Resto del código para calcular precios, mostrar detalles y confirmar la compra
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
