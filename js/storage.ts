const storage = {
    obtenerCarrito: function () {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    },

    guardarCarrito: function (carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    },

    limpiarCarrito: function () {
        localStorage.removeItem('carrito');
    },

    obtenerUsuario: function () {
        return JSON.parse(localStorage.getItem('usuario')) || null;
    },

    guardarUsuario: function (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
    },

    limpiarUsuario: function () {
        localStorage.removeItem('usuario');
    }
};