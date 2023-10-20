let productosComprados = [];
let productosFiltrados = [];
let productos; // Variable para almacenar los productos

function mostrarMensaje(mensaje, tipo) {
  Swal.fire({
    title: mensaje,
    icon: tipo === 'mensaje-error' ? 'error' : 'success',
    timer: 3000,
    showConfirmButton: false
  });
}

function renderizarProductos() {
  const productosContainer = document.getElementById('productos-disponibles-container');
  productosContainer.innerHTML = '';

  fetch('productos.json') // Ruta al archivo JSON local
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo JSON.');
      }
      return response.json();
    })
    .then(data => {
      productos = data; // Almacenamos los productos en la variable
      data.forEach((producto, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const imagen = document.createElement('img');
        imagen.src = `img/${producto.imagen}`;
        imagen.alt = producto.nombre;
        productCard.appendChild(imagen);

        const nombre = document.createElement('h3');
        nombre.textContent = producto.nombre;
        productCard.appendChild(nombre);

        const precio = document.createElement('p');
        precio.textContent = `Precio: $${producto.precio}`;
        productCard.appendChild(precio);

        const cantidadLabel = document.createElement('label');
        cantidadLabel.textContent = 'Cantidad (en kilos):';
        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.min = '0';
        cantidadInput.step = '0.1';
        cantidadInput.placeholder = 'Cantidad en kilos';
        cantidadInput.id = `cantidad-${index}`;
        productCard.appendChild(cantidadLabel);
        productCard.appendChild(cantidadInput);

        const button = document.createElement('button');
        button.textContent = 'Agregar al carrito';
        button.addEventListener('click', () => agregarProductoAlCarrito(index));
        productCard.appendChild(button);

        productosContainer.appendChild(productCard);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

function mostrarResumenCompra() {
  const resumenCompraElement = document.getElementById('resumen-compra');
  resumenCompraElement.innerHTML = '';

  const ul = document.createElement('ul');
  productosComprados.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>Producto:</span> ${item.nombre}<br>
      <span>Cantidad:</span> ${item.cantidad} kilos<br>
      <span>Precio por kilo (sin IVA):</span> $${(item.precioSinIva / item.cantidad).toFixed(2)}<br>
      <span>Precio total (sin IVA):</span> $${item.precioSinIva.toFixed(2)}<br>
      <span>Precio total (con IVA):</span> $${item.precioConIva.toFixed(2)}<br><br>`;
    ul.appendChild(li);
  });

  resumenCompraElement.appendChild(ul);
}

function mostrarProductosFiltrados() {
  const productosFiltradosTexto = document.getElementById('productos-filtrados-texto');
  productosFiltradosTexto.innerHTML = '';

  // Verificar si se aplicó un filtro antes de mostrar el mensaje
  if (productosFiltrados.length > 0) {
    const ul = document.createElement('ul');
    productosFiltrados.forEach(producto => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>Producto:</span> ${producto.nombre}<br>
        <span>Precio con IVA:</span> $${producto.precioConIva.toFixed(2)}<br><br>`;
      ul.appendChild(li);
    });

    productosFiltradosTexto.appendChild(ul);
  }
}

function calcularPrecioConIva(precio, cantidad, iva) {
  const precioSinIva = precio * cantidad;
  const precioConIva = iva * precioSinIva;
  return { precioSinIva, precioConIva };
}

function agregarProductoAlCarrito(index) {
  const cantidadProducto = parseFloat(document.getElementById(`cantidad-${index}`).value);

  if (!isNaN(cantidadProducto) && cantidadProducto > 0) {
    const productoSeleccionado = productos[index]; // Obtener el producto del array cargado desde el JSON
    const iva = Math.random() > 0.5 ? 1.21 : 1.1;

    const productoYaComprado = productosComprados.some(item => item.nombre === productoSeleccionado.nombre);
    if (productoYaComprado) {
      mostrarMensaje('Este producto ya ha sido comprado. Por favor, elige otro producto.', 'mensaje-error');
      return;
    }

    const { precioSinIva, precioConIva } = calcularPrecioConIva(productoSeleccionado.precio, cantidadProducto, iva);

    productosComprados.push({
      nombre: productoSeleccionado.nombre,
      cantidad: cantidadProducto,
      precioConIva,
      precioSinIva
    });

    localStorage.setItem('productosComprados', JSON.stringify(productosComprados));
    mostrarResumenCompra();
    mostrarProductosFiltrados();

    if (productosComprados.length > 4) {
      mostrarMensaje('¡Has comprado los 4 productos disponibles!', 'mensaje-exito');
    }

    // Agregar un mensaje de notificación Toastify
    Toastify({
      text: 'Agregado al carrito',
      duration: 3000,
      gravity: 'center',
      style: {
        background: 'green',
        color: 'white',
      },
    }).showToast();
    
  } else {
    mostrarMensaje('Cantidad no válida. Debes ingresar una cantidad mayor que 0.', 'mensaje-error');
  }
  localStorage.setItem('resumenCompra', JSON.stringify(productosComprados));
}

function limpiarCarritoYFiltrados() {
  productosComprados = [];
  productosFiltrados = [];
  localStorage.removeItem('productosComprados');
  localStorage.removeItem('resumenCompra');
  localStorage.removeItem('productosFiltrados');
  mostrarResumenCompra();
  mostrarProductosFiltrados();
}

const filtrarBtn = document.getElementById('filtrar-btn');

filtrarBtn.addEventListener('click', () => {
  const checkboxMayor = document.getElementById('filtrar-por-mayor');
  const checkboxMenor = document.getElementById('filtrar-por-menor');
  const precioFiltroInput = document.getElementById('precio-filtro');
  const precioFiltro = parseFloat(precioFiltroInput.value);

  if (isNaN(precioFiltro) || precioFiltro <= 0) {
    mostrarMensaje('Por favor, introduce un precio válido para filtrar.', 'mensaje-error');
    return;
  }

  if (!checkboxMayor.checked && !checkboxMenor.checked) {
    mostrarMensaje('Debes seleccionar al menos un tipo de filtrado.', 'mensaje-error');
    return;
  }

  const filtroMayor = checkboxMayor.checked;
  const filtroMenor = checkboxMenor.checked;

  const hayElementosParaFiltrar = productosComprados.some(producto => {
    if ((filtroMayor && producto.precioConIva > precioFiltro) || (filtroMenor && producto.precioConIva < precioFiltro)) {
      return true;
    }
    return false;
  });

  if (!hayElementosParaFiltrar) {
    Swal.fire({
      title: 'No hay nada para filtrar',
      text: 'No se encontraron productos que cumplan con los criterios de filtrado.',
      icon: 'error',
    });
  } else {
    productosFiltrados = productosComprados.filter(producto => {
      if ((filtroMayor && producto.precioConIva > precioFiltro) || (filtroMenor && producto.precioConIva < precioFiltro)) {
        return true;
      }
      return false;
    });

    mostrarProductosFiltrados();
    localStorage.setItem('productosFiltrados', JSON.stringify(productosFiltrados));
  }
});


document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos();

  const checkboxMayor = document.getElementById('filtrar-por-mayor');
  const checkboxMenor = document.getElementById('filtrar-por-menor');
  const limpiarBtn = document.getElementById('limpiar-btn');

  checkboxMayor.addEventListener('change', () => {
    if (checkboxMayor.checked) {
      checkboxMenor.checked = false;
    }
  });

  checkboxMenor.addEventListener('change', () => {
    if (checkboxMenor.checked) {
      checkboxMayor.checked = false;
    }
  });

  limpiarBtn.addEventListener('click', () => {
    if (productosComprados.length === 0 && productosFiltrados.length === 0) {
      // Si no hay nada que limpiar, muestra un SweetAlert
      Swal.fire({
        title: 'Nada que limpiar',
        text: 'Tu carrito de compras y la lista de productos filtrados ya están vacíos.',
        icon: 'error',
      });
    } else {
      // Si hay algo que limpiar, realiza la limpieza
      limpiarCarritoYFiltrados();
    }
  });

  // Mostrar Resumen de compra almacenado en localStorage
  const productosCompradosString = localStorage.getItem('productosComprados');
  if (productosCompradosString) {
    productosComprados = JSON.parse(productosCompradosString);
    mostrarResumenCompra();
  }

  // Mostrar Resumen filtrado almacenado en localStorage
  const productosFiltradosString = localStorage.getItem('productosFiltrados');
  if (productosFiltradosString) {
    productosFiltrados = JSON.parse(productosFiltradosString);
    mostrarProductosFiltrados();
  }
});
