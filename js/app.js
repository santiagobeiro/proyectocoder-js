document.addEventListener("DOMContentLoaded", function () {
    let overlay = document.getElementById("overlay");
    let nombreOverlay = document.getElementById("nombre-overlay");
    let edadOverlay = document.getElementById("edad-overlay");

    let nombreGuardado = localStorage.getItem("nombre");
    let edadGuardada = localStorage.getItem("edad");
    if (nombreGuardado &&
        edadGuardada &&
        verificarEdad(edadGuardada) &&
        nombreGuardado.length >= 3) {
        overlay.style.display = "none";
    } else {
        overlay.style.display = "flex";
    }

    document.getElementById("verificar-btn").addEventListener("click", function () {
        let nombre = nombreOverlay.value;
        let edad = edadOverlay.value;

        if (verificarEdad(edad) && nombre.length >= 3) {
            overlay.style.display = "none";
            localStorage.setItem("nombre", nombre);
            localStorage.setItem("edad", edad);

            Swal.fire({
                icon: 'success',
                title: 'Verificación Exitosa!',
                text: 'Has sido verificado correctamente.',
                showConfirmButton: false,
                timer: 2500,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en la Verificación',
                text: 'Nombre inválido o edad insuficiente.',
                showConfirmButton: false,
                timer: 2500,
            });
        }
    });

    let carrito = [];
    let productos = [];

    function obtenerProductos() {
        fetch('./data/productos.json') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                return response.json();
            })
            .then(data => {
                productos = data; 
                renderProductos(productos);
            })            
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    }
    
    function ordenarPorPrecio(orden) {
        if (orden === "precio-ascendente") {
            return productos.slice().sort((a, b) => a.precio - b.precio);
        } else if (orden === "precio-descendente") {
            return productos.slice().sort((a, b) => b.precio - a.precio);
        } else {
            // Si el orden no está definido, devuelve el arreglo original
            return productos;
        }
    }

    function verificarEdad(edad) {
        return edad >= 18;
    }

    document.getElementById("filtro").addEventListener("change", function () {
        const orden = this.value;
        const productosOrdenados = ordenarPorPrecio(orden);
        renderProductos(productosOrdenados);
    });

    function getCantidadEnCarrito(producto) {
        const productoEnCarrito = carrito.find((p) => p.id === producto.id);
        return productoEnCarrito ? productoEnCarrito.cantidad : 1;
    }

    function renderProductos(productos) {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = '';
    
        productos.forEach(producto => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('producto', 'col-md-7');
            productDiv.innerHTML = `
                <div class='producto-carrito'>
                    <h1 class="nombre-producto">${producto.nombre}</h1>
                    <p>$${producto.precio}</p>
                    <img class="imagen-producto" src="${producto.imagenURL}" alt="${producto.nombre}">
                    <p>Cantidad</p>
                    <input type="number" class="cantidad-input" value="${getCantidadEnCarrito(producto)}" min="1">
                    <button class="boton-agregar">Agregar al carrito</button>
                </div>
            `;
            productContainer.appendChild(productDiv);
    
            const addButton = productDiv.querySelector('.boton-agregar');
            addButton.addEventListener('click', () => {
                const cantidadInput = productDiv.querySelector('.cantidad-input');
                const cantidad = parseInt(cantidadInput.value);
                if (cantidad > 0) {
                    const productoEnCarrito = carrito.find((p) => p.id === producto.id);
                    if (productoEnCarrito) {
                        productoEnCarrito.cantidad += cantidad;
                    } else {
                        carrito.push({ ...producto, cantidad });
                    }
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito();
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito!',
                        text: `Se ha(n) agregado ${cantidad} ${cantidad > 1 ? 'productos' : 'producto'} al carrito.`,
                        imageUrl: producto.imagenURL,
                        imageWidth: 150,
                        imageHeight: 150,
                        imageAlt: producto.nombre,
                        showConfirmButton: false,
                        timer: 2500, // Tiempo en milisegundos que se mostrará el SweetAlert
                    });
                }
            });
        });
    }

    function mostrarCarrito() {
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = '';
        let precioTotal = 0;

        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            const productosAgrupados = agruparProductosPorId(carrito);

            productosAgrupados.forEach((producto) => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('carrito-contenedor-1');
                productDiv.innerHTML = `
                    <h1 class="nombre-carrito">${producto.nombre}</h1>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <p>$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    <img class="imagen-producto" src="${producto.imagenURL}" alt="${producto.nombre}">
                    <button class="productos-btns eliminar-producto-btn" data-id="${producto.id}">Eliminar el producto</button>
                `;
                cartContainer.appendChild(productDiv);
                precioTotal += producto.precio * producto.cantidad;
            });

            if (carrito.length > 0) {
                // Agregar el botón de "Finalizar Compra" solo si el carrito no está vacío
                const finalizarCompraBtn = document.createElement('button');
                finalizarCompraBtn.classList.add('finalizar-compra-btn', 'productos-btns');
                finalizarCompraBtn.textContent = 'Finalizar Compra';
                cartContainer.appendChild(finalizarCompraBtn);
                finalizarCompraBtn.addEventListener('click', () => {
                    carrito = [];
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito();

                    Swal.fire({
                        icon: 'success',
                        title: '¡Tu compra ha sido realizada!',
                        text: 'Gracias por tu compra.',
                        showConfirmButton: false,
                        timer: 2500, // Tiempo en milisegundos que se mostrará el SweetAlert
                    });
                });
            }

            const vaciarCarritoBtn = document.getElementById('vaciar-carrito-btn');
            vaciarCarritoBtn.addEventListener('click', () => {
                carrito = [];
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            });

            productosAgrupados.forEach((producto) => {
                const deleteButton = cartContainer.querySelector(`[data-id="${producto.id}"]`);
                deleteButton.addEventListener('click', () => {
                    mostrarDialogoCantidad(producto);
                });
            });
        }

        const precioTotalElement = document.createElement('p');
        precioTotalElement.textContent = `Precio Total: $${precioTotal.toFixed(2)}`;
        cartContainer.appendChild(precioTotalElement);
    }

    function eliminarProductoDelCarrito(producto, cantidad) {
        const index = carrito.findIndex((p) => p.id === producto.id);
        if (index !== -1) {
            if (cantidad >= carrito[index].cantidad) {
                carrito.splice(index, 1);
            } else {
                carrito[index].cantidad -= cantidad;
            }
            sincronizarCarrito();
            mostrarCarrito();
        }
    }

    function sincronizarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function mostrarDialogoCantidad(producto) {
        Swal.fire({
            title: `Eliminar ${producto.nombre}`,
            input: 'number',
            inputLabel: 'Cantidad a eliminar',
            inputAttributes: {
                min: 1,
                max: producto.cantidad,
                step: 1,
            },
            inputValue: 1,
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const cantidad = parseInt(result.value);
                eliminarProductoDelCarrito(producto, cantidad);

                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado',
                    text: `Se han eliminado ${cantidad} ${cantidad > 1 ? 'unidades' : 'unidad'} de ${producto.nombre} del carrito.`,
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        });
    }

    function agruparProductosPorId(carrito) {
        const productosAgrupados = [];

        carrito.forEach((producto) => {
            const index = productosAgrupados.findIndex((p) => p.id === producto.id);
            if (index === -1) {
                productosAgrupados.push({ ...producto, cantidad: producto.cantidad });
            } else {
                productosAgrupados[index].cantidad += producto.cantidad;
            }
        });

        return productosAgrupados.filter((producto) => producto.cantidad > 0);
    }

    mostrarCarrito();
    obtenerProductos();
});
