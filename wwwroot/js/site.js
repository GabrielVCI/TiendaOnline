function AgregarProducto() {

    productosListadoViewModel.productos.push(
        new elementoListadoProductosVM({ id: 0, nombre: "", precio: "", fechaCreacion: "" })
    );
};

async function enviarProducto(producto) {

    try {
 

        const object = {
            Nombre: producto.nombre(),
            Precio: producto.precio(),
            FechaCreacion: producto.fechaCreacion(),
            
        };

        const data = JSON.stringify(object);

        const response = await fetch(urlProductos, {
            method: "POST",
            body: data,
            headers: {
                'Content-Type': "application/json"
            }
        });

        if (!response.ok) {

            manejarErrorApi(response);
            return;
        }
        await ObtenerProductos();

        MensajeDeExito("Producto agregado correctamente");

    } catch (error) {
        console.log(error);
        return;
    }
}

function focusOutProductos() {

    productosListadoViewModel.productos.pop();
}

async function ObtenerProductos() {

    try {
        productosListadoViewModel.cargando(true);

        const response = await fetch(urlProductos, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            }
        });

        if (!response.ok) {
            manejarErrorApi(response);
            return;
        }

        productosListadoViewModel.productos([]);

        const json = await response.json();

        json.forEach(prod => {
            const vm = new elementoListadoProductosVM(prod);
            productosListadoViewModel.productos.push(vm);
        });

        productosListadoViewModel.cargando(false);

    } catch (error) {
        console.log(error);
        return;
    }
}


async function obtenerProductoAEditar(producto) {

    try {

        const response = await fetch(`${urlProductos}/${producto.id()}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            }
        });

        if (!response.ok) {
            manejarErrorApi(error);
            return;
        }

        const json = await response.json();

        // Convertir la fecha a formato YYYY-MM-DD si está en formato completo
        const fecha = new Date(json.fechaCreacion);
        const fechaFormateada = fecha.toISOString().split('T')[0];

        productoEditarViewModel.id = json.id;
        productoEditarViewModel.nombre(json.nombre);
        productoEditarViewModel.precio(json.precio);
        productoEditarViewModel.fechaCreacion(fechaFormateada);
       
        modalEditarProductoBTSP.show();
        console.log(json)

    } catch (error) {
        console.log(error);
        return;
    }

}

async function editarProducto(producto) {

    try {

        const objeto = {
            Id: producto.id,
            Nombre: producto.nombre(),
            Precio: producto.precio(),
            FechaCreacion: producto.fechaCreacion(),
        }

        const data = JSON.stringify(objeto);

        const response = await fetch(`${urlProductos}/${producto.id}`, {
            method: "PUT",
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            manejarErrorApi(response);
            return;
        }


        const json = await response.json;
        await ObtenerProductos();

        modalEditarProductoBTSP.hide();
       
        return json;

    } catch (error) {
        console.log(error)
        
        return;
    }

}

async function eliminarProducto(producto) {
    try {
   
        const response = await fetch(`${urlProductos}/${producto.id()}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            manejarErrorApi(error);
            return;
        }

        productosListadoViewModel.productos.remove(function (prod) { return prod.id == producto.id() });

        MensajeDeExito("Producto eliminado");

        await ObtenerProductos();

    } catch (error) {
        console.log(error)
        
        return;
    }
}


function confimarEliminacionProducto(producto) {

    confirmarAction({
        callbackAceptar: () => {

            eliminarProducto(producto);
        },

        callbackCancelar: () => {
            return;
        },

        titulo: `Desea borrar el producto ${producto.nombre()} de la lista?`,

        text: "Se borrará de la base de datos"

    });
}



async function ObtenerProductoPorIdFiltro(idProducto) {

    try {
        if (idProducto.trim().length == 0) {
            return;
        }
        const parametros = new URLSearchParams({
            ProductoId: idProducto || ""
        });

        const response = await fetch(`${urlProductos}/obtenerProductoPorId?${parametros}`, {

            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {

            manejarErrorApi(response);
            return;
        }

        

        const json = await response.json();
        productosListadoViewModel.productos([]);
        
        const vm = new elementoListadoProductosVM(json);
         productosListadoViewModel.productos.push(vm);
    } catch (error) {
        
        console.log(error)
        return;
    }
}