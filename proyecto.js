const productosDisponibles = [
  { nombre: 'Manzanas', precio: 640 },
  { nombre: 'Bananas', precio: 350 },
  { nombre: 'Queso', precio: 125 },
  { nombre: 'Pan', precio: 800 }
];

let productosComprados = [];
let productosFiltrados = [];

// Función para renderizar la lista de productos disponibles
function renderizarProductos() {
  const listaProductos = document.getElementById('productos-disponibles');
  listaProductos.innerHTML = '';

  productosDisponibles.forEach((producto, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${producto.nombre} - $${producto.precio}`;
    listaProductos.appendChild(li);
  });
}

// Función para mostrar el resumen de la compra
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

// Obtener datos del resumen de compra desde el almacenamiento local
const resumenCompraLocalStorage = localStorage.getItem('resumenCompra');
if (resumenCompraLocalStorage) {
  productosComprados = JSON.parse(resumenCompraLocalStorage);
  mostrarResumenCompra();
}

// Función para mostrar los productos filtrados
function mostrarProductosFiltrados() {
  const productosFiltradosTexto = document.getElementById('productos-filtrados-texto');
  productosFiltradosTexto.innerHTML = '';

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

// Obtener datos de productos filtrados desde el almacenamiento local
const productosFiltradosLocalStorage = localStorage.getItem('productosFiltrados');
if (productosFiltradosLocalStorage) {
  productosFiltrados = JSON.parse(productosFiltradosLocalStorage);
  mostrarProductosFiltrados();
}

// Función para calcular el precio con IVA
function calcularPrecioConIva(precio, cantidad, iva) {
  const precioSinIva = precio * cantidad;
  const precioConIva = iva * precioSinIva;
  return { precioSinIva, precioConIva };
}

// Evento cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Obtener elementos HTML y configurar event listeners
  const checkboxMayor = document.getElementById('filtrar-por-mayor');
  const checkboxMenor = document.getElementById('filtrar-por-menor');
  const comprarBtn = document.getElementById('comprar-btn');
  const limpiarBtn = document.getElementById('limpiar-btn');
  const filtrarBtn = document.getElementById('filtrar-btn');

  // Event listener para checkbox "Mayor"
  checkboxMayor.addEventListener('change', () => {
    if (checkboxMayor.checked) {
      checkboxMenor.checked = false;  // Desmarcar el otro checkbox
    }
  });

  // Event listener para checkbox "Menor"
  checkboxMenor.addEventListener('change', () => {
    if (checkboxMenor.checked) {
      checkboxMayor.checked = false;  // Desmarcar el otro checkbox
    }
  });

  // Evento al hacer clic en el botón "Comprar"

  comprarBtn.addEventListener('click', () => {
    const seleccionProducto = document.getElementById('seleccion-producto').value;
    const cantidadProducto = parseFloat(document.getElementById('cantidad-producto').value);
  
    if (!isNaN(cantidadProducto) && cantidadProducto > 0) {
      const productoSeleccionado = productosDisponibles[seleccionProducto];
      const iva = Math.random() > 0.5 ? 1.21 : 1.1;
  
      // Verificar si el producto ya ha sido comprado
      const productoYaComprado = productosComprados.some(item => item.nombre === productoSeleccionado.nombre);
      if (productoYaComprado) {
        alert("Este producto ya ha sido comprado. Por favor, elige otro producto.");
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
  
      // Verificar si se han comprado los 4 productos
      if (productosComprados.length > 4) {
        alert("¡Has comprado los 4 productos disponibles!");
      }
    } else {
      alert("Cantidad no válida. Debes ingresar una cantidad mayor que 0.");
    }
    localStorage.setItem('resumenCompra', JSON.stringify(productosComprados));
  });
  
  // Evento al hacer clic en el botón "Limpiar"
  limpiarBtn.addEventListener('click', () => {
    productosComprados = [];
    productosFiltrados = [];
    localStorage.removeItem('productosComprados');
    localStorage.removeItem('resumenCompra');  // Nuevo: Borrar el resumen de compra
    localStorage.removeItem('productosFiltrados');  // Nuevo: Borrar productos filtrados
    mostrarResumenCompra();
    mostrarProductosFiltrados();
  });
  

  // Evento al hacer clic en el botón "Filtrar"
  filtrarBtn.addEventListener('click', () => {
    const seleccionProducto = document.getElementById('seleccion-producto').value;
  
    if (!checkboxMayor.checked && !checkboxMenor.checked) {
      alert("Debes seleccionar al menos un tipo de filtrado.");
      return;
    }
  
    const precioFiltroInput = document.getElementById('precio-filtro');
    const precioFiltro = parseFloat(precioFiltroInput.value);
  
    if (!isNaN(precioFiltro) && precioFiltro >= 0) {
      const filtroMayor = checkboxMayor.checked;
      const filtroMenor = checkboxMenor.checked;
  
      productosFiltrados = productosComprados.filter(producto => {
        if (filtroMayor && producto.precioConIva > precioFiltro) {
          return true;
        }
        if (filtroMenor && producto.precioConIva < precioFiltro) {
          return true;
        }
        return false;
      });
  
      mostrarProductosFiltrados();
    } else {
      alert("Precio no válido. Por favor, ingrese un número mayor o igual a 0.");
    }
    localStorage.setItem('productosFiltrados', JSON.stringify(productosFiltrados));
  });
});
