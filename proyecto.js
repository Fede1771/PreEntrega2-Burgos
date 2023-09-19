const Producto = function(nombre, precio) {
  this.nombre = nombre;
  this.precio = precio;
}

const manzanas = new Producto('Manzanas', 640);
const bananas = new Producto('Bananas', 350);
const queso = new Producto('Queso', 125);
const pan = new Producto('Pan', 800);

let productosDisponibles = [manzanas, bananas, queso, pan];
let productosComprados = [];

const calcularPrecioConIva = (precio, cantidad, calcularIva) => {
  const precioSinIva = precio * cantidad;
  const precioConIva = calcularIva(precioSinIva);
  return { precioSinIva, precioConIva };
}

const ivaEstandar = 1.21;
const ivaReducido = 1.1;

const calcularPrecioConIvaEstandar = (precioSinIva) => precioSinIva * ivaEstandar;
const calcularPrecioConIvaReducido = (precioSinIva) => precioSinIva * ivaReducido;

const mostrarPrecio = (producto, precioConIva, precioSinIva, cantidad) => {
  alert(`Has seleccionado ${cantidad} kilos de ${producto}. \nEl precio total con IVA es: $${precioConIva.toFixed(2)} \nEl precio sin IVA es: $${precioSinIva.toFixed(2)}`);
}

const buscarProductoPorNombre = (nombre) => {
  return productosDisponibles.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());
}

function obtenerCantidadValida(productoSeleccionado) {
  let cantidad;
  do {
    const userInput = prompt(`¿Cuántos kilos de ${productoSeleccionado} deseas comprar?`);
    cantidad = parseFloat(userInput);

    if (isNaN(cantidad) || cantidad <= 0) {
      mostrarError("Cantidad no válida. Debes ingresar una cantidad mayor que 0.");
    }
  } while (isNaN(cantidad) || cantidad <= 0);

  return cantidad;
}

function mostrarError(mensaje) {
  alert(`Error: ${mensaje}`);
}

function esFiltroValido(filtro) {
  return filtro === 'mayor' || filtro === 'menor';
}

let seguirComprando = true;
let productosSeleccionados = 0;
let agradecimientoMostrado = false;

while (seguirComprando) {
  let productosTexto = "Bienvenido al almacén ´Simona´ de tu barrio\n¿Qué vas a elegir hoy? Esto tenemos hoy en stock:\n";

  productosDisponibles.forEach((producto, index) => {
    const yaComprado = productosComprados.some(item => item.nombre === producto.nombre);
    productosTexto += `${index + 1}. ${producto.nombre} - $${producto.precio} ${yaComprado ? '(Ya comprado)' : ''}\n`;
  });

  productosTexto += "Si quiere salir de esta ventana por favor escriba CANCELAR";

  const userInput = prompt(productosTexto);

  if (userInput === null) {
    // El usuario cerró la ventana de diálogo
    seguirComprando = false;
    break; // Salir completamente del bucle
  } else if (userInput.trim().toLowerCase() === "cancelar") {
    seguirComprando = false;
    break; // Salir completamente del bucle
  } else {
    const selectedProductIndex = parseInt(userInput) - 1;
    const selectedProduct = productosDisponibles[selectedProductIndex];

    if (!selectedProduct) {
      mostrarError("Selección no válida. Por favor, elige una opción válida.");
      continue;
    }

    const yaComprado = productosComprados.some(item => item.nombre === selectedProduct.nombre);
    if (yaComprado) {
      mostrarError("Este producto ya ha sido comprado. Por favor, elige otro.");
      continue;
    }

    let productoSeleccionado = selectedProduct.nombre;
    let precioProducto = selectedProduct.precio;

    const cantidad = obtenerCantidadValida(productoSeleccionado);
    productosSeleccionados++;

    const { precioSinIva, precioConIva } = calcularPrecioConIva(
      precioProducto,
      cantidad,
      calcularPrecioConIvaEstandar
    );

    mostrarPrecio(productoSeleccionado, precioConIva, precioSinIva, cantidad);

    productosComprados.push({
      nombre: productoSeleccionado,
      cantidad,
      precioConIva,
      precioSinIva
    });

    if (productosSeleccionados >= 4) {
      seguirComprando = false;
    } else {
      seguirComprando = confirm("¿Desea comprar algo más?");
    }
  }
}

const resumenTextoElement = document.getElementById('resumen-texto');
let resumenCompra = "Resumen de tu compra:\n\n";
let precioTotalConIva = 0;
let precioTotalSinIva = 0;

productosComprados.forEach(item => {
  resumenCompra += `Producto: ${item.nombre}\n`;
  resumenCompra += `Cantidad: ${item.cantidad} kilos\n`;
  resumenCompra += `Precio por kilo (sin IVA): $${(item.precioSinIva / item.cantidad).toFixed(2)}\n`;
  resumenCompra += `Precio total (sin IVA): $${item.precioSinIva.toFixed(2)}\n`;
  resumenCompra += `Precio total (con IVA): $${item.precioConIva.toFixed(2)}\n\n`;

  precioTotalConIva += item.precioConIva;
  precioTotalSinIva += item.precioSinIva;
});

resumenCompra += `Precio total de tu compra (sin IVA): $${precioTotalSinIva.toFixed(2)}\n`;
resumenCompra += `Precio total de tu compra(con IVA): $${precioTotalConIva.toFixed(2)}\n`;

resumenTextoElement.textContent = resumenCompra;

if (productosComprados.length > 0) {
  let filtroPor;

  while (true) {
    filtroPor = prompt("¿Quiere filtrar por productos con precio mayor o menor al indicado? Responda 'mayor' o 'menor'.").toLowerCase();

    if (esFiltroValido(filtroPor)) {
      break;
    } else {
      mostrarError("Opción no válida. Por favor, ingrese 'mayor' o 'menor'.");
    }
  }

  let precioFiltro;

  while (true) {
    const userInput = prompt(`Ingrese el precio para filtrar los productos (+ IVA ${filtroPor} a este precio):`);
    precioFiltro = parseFloat(userInput);

    if (!isNaN(precioFiltro) && precioFiltro >= 0) {
      break;
    } else {
      mostrarError("Precio no válido. Por favor, ingrese un número mayor o igual a 0.");
    }
  }

  const productosFiltradosElement = document.getElementById('productos-filtrados-texto');
  productosFiltradosElement.innerHTML = "";

  const productosFiltrados = productosComprados.filter(producto => {
    if (filtroPor === 'mayor') {
      return producto.precioConIva > precioFiltro;
    } else {
      return producto.precioConIva < precioFiltro;
    }
  });

  if (productosFiltrados.length > 0) {
    let mensajeFiltrados = `<h3>Productos con precio (con IVA) ${filtroPor} a $${precioFiltro.toFixed(2)}:</h3><ul>`;
    productosFiltrados.forEach(producto => {
      mensajeFiltrados += `<li><strong>Producto:</strong> ${producto.nombre}<br><strong>Precio con IVA:</strong> $${producto.precioConIva.toFixed(2)}</li>`;
    });
    mensajeFiltrados += "</ul>";
    productosFiltradosElement.innerHTML = mensajeFiltrados;
  } else {
    productosFiltradosElement.innerHTML = `<p>No hay productos que cumplan con el criterio de precio ${filtroPor} a $${precioFiltro.toFixed(2)}.</p>`;
  }
} else {
  alert("No has comprado ningún producto. Gracias por visitarnos. ¡Hasta luego!");
}
