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

let seguirComprando = true;
let productosSeleccionados = 0;
let agradecimientoMostrado = false;

while (seguirComprando) {
  let productoSeleccionado;

  let productosTexto = "Bienvenido al almacén ´Simona´ de tu barrio\n¿Qué vas a elegir hoy? Esto tenemos hoy en stock:\n";

  productosDisponibles.forEach((producto, index) => {
      const yaComprado = productosComprados.some(item => item.nombre === producto.nombre);
      productosTexto += `${index + 1}. ${producto.nombre} - $${producto.precio} ${yaComprado ? '(Ya comprado)' : ''}\n`;
  });

  productosTexto += "Si quiere salir de esta ventana por favor escriba CANCELAR";

  const userInput = prompt(productosTexto);

  if (userInput.toLowerCase() === "cancelar") {
      alert("Gracias por visitarnos. ¡Hasta luego!");
      seguirComprando = false;
      continue;
  }

  const selectedProductIndex = parseInt(userInput) - 1;
  const selectedProduct = productosDisponibles[selectedProductIndex];

  if (!selectedProduct) {
      alert("Selección no válida. Por favor, elige una opción válida.");
      continue;
  }

  const yaComprado = productosComprados.some(item => item.nombre === selectedProduct.nombre);
  if (yaComprado) {
      alert("Este producto ya ha sido comprado. Por favor, elige otro.");
      continue;
  }

  productoSeleccionado = selectedProduct.nombre;
  precioProducto = selectedProduct.precio;

  let cantidad;

  do {
      cantidad = parseFloat(prompt(`¿Cuántos kilos de ${productoSeleccionado} deseas comprar?`));

      if (isNaN(cantidad) || cantidad <= 0) {
          alert("Cantidad no válida. Debes ingresar una cantidad mayor que 0.");
      }
  } while (isNaN(cantidad) || cantidad <= 0);

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
      let continuarComprando = prompt("¿Desea comprar algo más? Responda 'si' o 'no'.");

      while (continuarComprando.toLowerCase() !== 'si' && continuarComprando.toLowerCase() !== 'no') {
          continuarComprando = prompt("Por favor, responda 'si' o 'no':");
      }

      if (continuarComprando.toLowerCase() === 'no') {
          seguirComprando = false;
          alert("Gracias por tu visita. ¡Hasta luego!");
      }
  }
}

// Mostrar resumen de compra en la sección específica
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

// Preguntar por el precio para filtrar
const precioFiltro = parseFloat(prompt("Ingrese el precio para filtrar los productos (con IVA mayor a este precio):"));

// Filtrar productos
const productosFiltrados = productosComprados.filter(producto => producto.precioConIva > precioFiltro);

// Mostrar productos filtrados
if (productosFiltrados.length > 0) {
  let mensajeFiltrados = "Productos con precio (con IVA) mayor al indicado:\n";
  productosFiltrados.forEach(producto => {
      mensajeFiltrados += `${producto.nombre} - Precio con IVA: $${producto.precioConIva.toFixed(2)}\n`;
  });
  alert(mensajeFiltrados);
} else {
  alert("No hay productos que cumplan con el criterio de filtrado.");
}

// Agradecimiento por la compra
if (productosComprados.length > 0 && !agradecimientoMostrado) {
  alert("¡Gracias por tu compra en Tienda Simona!");
  agradecimientoMostrado = true;
}
