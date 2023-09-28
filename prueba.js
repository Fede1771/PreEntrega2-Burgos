const mostrarMensaje = (mensaje) => {
    const mensajeElement = document.createElement('div');
    mensajeElement.textContent = mensaje;
    document.body.appendChild(mensajeElement);
  };
  
  const mostrarError = (mensaje) => {
    mostrarMensaje(`Error: ${mensaje}`);
  };
  
  const obtenerEntradaUsuario = () => {
    const userInput = document.getElementById('entrada-usuario').value;
    return userInput.trim().toLowerCase();
  };
  
  function obtenerCantidadValida(productoSeleccionado) {
    let cantidad;
  
    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.placeholder = `Cantidad de ${productoSeleccionado}`;
    cantidadInput.id = 'entrada-usuario';
  
    const confirmarBtn = document.createElement('button');
    confirmarBtn.textContent = 'Confirmar';
  
    const container = document.createElement('div');
    container.appendChild(cantidadInput);
    container.appendChild(confirmarBtn);
  
    mostrarMensaje('¿Cuántos kilos deseas comprar?');
    document.body.appendChild(container);
  
    return new Promise((resolve) => {
      confirmarBtn.addEventListener('click', () => {
        cantidad = parseFloat(obtenerEntradaUsuario());
  
        if (isNaN(cantidad) || cantidad <= 0) {
          mostrarError('Cantidad no válida. Debes ingresar una cantidad mayor que 0.');
          return;
        }
  
        document.body.removeChild(container);
        resolve(cantidad);
      });
    });
  }
  
  const mostrarResumenCompra = () => {
    const resumenTextoElement = document.getElementById('resumen-texto');
    resumenTextoElement.innerHTML = resumenCompra;
  
    const maxLengthPerAlert = 265;  
    let resumenCompraDividido = [];
  
    let currentPart = '';
    const lines = resumenCompra.split('<br>');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if ((currentPart + line).length < maxLengthPerAlert) {
        currentPart += line + '<br>';
      } else {
        resumenCompraDividido.push(currentPart);
        currentPart = line + '<br>';
      }
    }
    if (currentPart !== '') {
      resumenCompraDividido.push(currentPart);
    }
  
    resumenCompraDividido.forEach((part, index) => {
      const formattedMessage = formatearMensaje(part);
      mostrarMensaje(index === 0 ? formattedMessage : '...' + formattedMessage);
    });
  };
  
  const mostrarProductosFiltrados = (productosFiltrados) => {
    const productosFiltradosElement = document.getElementById('productos-filtrados-texto');
    productosFiltradosElement.innerHTML = '';
  
    if (productosFiltrados.length > 0) {
      let mensajeFiltrados = `<strong>Productos con precio (con IVA) ${filtroPor} a $${precioFiltro.toFixed(2)}:</strong><br><br>\n`;
  
      productosFiltrados.forEach(producto => {
        mensajeFiltrados += `<p>Producto: ${producto.nombre}<br>Precio con IVA: $${producto.precioConIva.toFixed(2)}</p><br>`;
      });
  
      productosFiltradosElement.innerHTML = mensajeFiltrados;
      mostrarMensaje(limpiarMensajeHTML(mensajeFiltrados));
    } else {
      productosFiltradosElement.innerHTML = `<p>No hay productos que cumplan con el criterio de precio ${filtroPor} a $${precioFiltro.toFixed(2)}.</p>`;
      mostrarMensaje(`No hay productos que cumplan con el criterio de precio ${filtroPor} a $${precioFiltro.toFixed(2)}.`);
    }
  };
  
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
  
  const formatearMensaje = (mensaje) => {
    return mensaje.replace(/<br>/g, '\n').replace(/<strong>|<\/strong>/g, '');
  };
  
  const limpiarMensajeHTML = (mensaje) => {
    return mensaje.replace(/<\/?[^>]+(>|$)/g, '');
  };
  
  const maxLengthPerAlert = 265;
  
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
      seguirComprando = false;
      break;
    } else if (userInput.trim().toLowerCase() === "cancelar") {
      seguirComprando = false;
      break;
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
  
      obtenerCantidadValida(productoSeleccionado).then(cantidad => {
        productosSeleccionados++;
  
        const { precioSinIva, precioConIva } = calcularPrecioConIva(
          precioProducto,
          cantidad,
          calcularPrecioConIvaEstandar
        );
  
        mostrarMensaje(`Has seleccionado ${cantidad} kilos de ${productoSeleccionado}. \nEl precio total con IVA es: $${precioConIva.toFixed(2)} \nEl precio sin IVA es: $${precioSinIva.toFixed(2)}`);
  
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
      });
    }
  }
  
  const resumenTextoElement = document.getElementById('resumen-texto');
  let resumenCompra = "Resumen de tu compra:<br><br>";
  let precioTotalConIva = 0;
  let precioTotalSinIva = 0;
  
  productosComprados.forEach(item => {
    resumenCompra += `<strong>Producto:</strong> ${item.nombre}<br>`;
    resumenCompra += `<strong>Cantidad:</strong> ${item.cantidad} kilos<br>`;
    resumenCompra += `<strong>Precio por kilo (sin IVA):</strong> $${(item.precioSinIva / item.cantidad).toFixed(2)}<br>`;
    resumenCompra += `<strong>Precio total (sin IVA):</strong> $${item.precioSinIva.toFixed(2)}<br>`;
    resumenCompra += `<strong>Precio total (con IVA):</strong> $${item.precioConIva.toFixed(2)}<br><br>`;
  
    precioTotalConIva += item.precioConIva;
    precioTotalSinIva += item.precioSinIva;
  });
  
  resumenCompra += `<strong>Precio total de tu compra (sin IVA):</strong> $${precioTotalSinIva.toFixed(2)}<br>`;
  resumenCompra += `<strong>Precio total de tu compra (con IVA):</strong> $${precioTotalConIva.toFixed(2)}<br>`;
  
  mostrarResumenCompra();
  
  if (productosComprados.length > 0) {
    let filtroPor;
  
    while (true) {
      filtroPor = prompt("¿Quiere filtrar por productos con precio mayor o menor al indicado? Responda 'mayor' o 'menor'.").toLowerCase();
  
      if (filtroPor === 'mayor' || filtroPor === 'menor') {
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
    productosFiltradosElement.innerHTML = '';
  
    const productosFiltrados = productosComprados.filter(producto => {
      if (filtroPor === 'mayor') {
        return producto.precioConIva > precioFiltro;
      } else {
        return producto.precioConIva < precioFiltro;
      }
    });
  
    mostrarProductosFiltrados(productosFiltrados);
  }
  