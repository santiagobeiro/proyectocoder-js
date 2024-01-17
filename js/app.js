document.addEventListener("DOMContentLoaded", function () {
    let overlay = document.getElementById("overlay");
    let nombreOverlay = document.getElementById("nombre-overlay");
    let edadOverlay = document.getElementById("edad-overlay");

    let nombreGuardado = localStorage.getItem("nombre");
    let edadGuardada = localStorage.getItem("edad");

    if (
        nombreGuardado &&
        edadGuardada &&
        verificarEdad(edadGuardada) &&
        nombreGuardado.length >= 3
    ) {
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

    class Producto {
        constructor(id, nombre, precio, imagenURL) {
            this.id = id;
            this.nombre = nombre;
            this.precio = precio;
            this.imagenURL = imagenURL;
        }
    }

    const productos = [
        new Producto(1, 'Cerveza Rubia Heineken', 899.99, "https://hiperlibertad.vteximg.com.br/arquivos/ids/158639-1000-1000/Cerveza-rubia-Heineken-710-Cc-C-HEINEKEN-LATA-710-CC-1-1561.jpg?v=637236252247400000"),
        new Producto(2, 'Cerveza Rubia Corona', 799.99, 'https://d2izjnmtylvtfh.cloudfront.net/21873937-thickbox_default/cerveza-corona-rubia-269ml.jpg'),
        new Producto(3, 'Vodka Smirnoff', 1499.99, 'https://d2r9epyceweg5n.cloudfront.net/stores/001/590/373/products/d_smirf1-aef2a6579975a035e916227587677140-1024-1024.jpg'),
        new Producto(4, 'Vodka Sky', 1199.99, 'https://www.rossofinefood.com/2378-large_default/skyy-vodka-1-l.jpg'),
        new Producto(5, 'Gancia Americano', 799.99, 'https://gobar.vtexassets.com/arquivos/ids/156378/GANICA.jpg?v=636716737494030000'),
        new Producto(6, 'Campari Aperitivo', 1899.99, 'https://d3ugyf2ht6aenh.cloudfront.net/stores/835/701/products/campari-aperitivo-750ml1-7cafead7a1f8a2358516661026421170-640-0.jpg'),
        new Producto(7, 'Champagne Chandon E.B', 3399.99, 'https://d2r9epyceweg5n.cloudfront.net/stores/001/069/568/products/champagne-chandon-extra-brut1-106a185e816b840ddb16215179739972-640-0.jpg'),
        new Producto(8, 'Whisky Jack Daniels', 15999.99, 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/384/985/products/whisky-jack-daniels-750-ml1-d9b2e5ecffb25327dd16203179065708-1024-1024.webp'),
    ];

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

    document.getElementById("filtro").addEventListener("change", function () {
        const orden = this.value;
        const productosOrdenados = ordenarPorPrecio(orden);
        renderProductos(productosOrdenados);
    });

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
    
    function getCantidadEnCarrito(producto) {
        const productoEnCarrito = carrito.find((p) => p.id === producto.id);
        return productoEnCarrito ? productoEnCarrito.cantidad : 1;
    }

    function verificarEdad(edad) {
        return edad >= 18;
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
    renderProductos(productos);
});