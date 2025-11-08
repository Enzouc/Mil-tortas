const validacion = {

    validationRules: [
        {
            id: 'nombre',
            errorId: 'nombre',
            validations: [
                {
                    check: (value) => !value.trim(),
                    message: 'El nombre es obligatorio'
                }
            ]
        },
        {
            id: 'email',
            errorId: 'email',
            validations: [
                {
                    check: (value) => !value.trim(),
                    message: 'El email es obligatorio'
                },
                {
                    check: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: 'El formato del email no es válido'
                }
            ]
        },
        {
            id: 'fecha-nacimiento',
            errorId: 'fecha',
            validations: [
                {
                    check: (value) => !value,
                    message: 'La fecha de nacimiento es obligatoria'
                },
                {
                    check: (value) => {
                        const fecha = new Date(value);
                        const hoy = new Date();
                        let edad = hoy.getFullYear() - fecha.getFullYear();
                        const mes = hoy.getMonth() - fecha.getMonth();
                        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
                            edad--;
                        }
                        return edad < 18;
                    },
                    message: 'Debes ser mayor de 18 años para registrarte'
                }
            ]
        },
        {
            id: 'password',
            errorId: 'password',
            validations: [
                {
                    check: (value) => !value,
                    message: 'La contraseña es obligatoria'
                },
                {
                    check: (value) => value.length < 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                }
            ]
        },
        {
            id: 'codigo-promocional',
            errorId: 'codigo',
            validations: [
                {
                    check: (value) => value && value !== 'FELICES50',
                    message: 'El código promocional no es válido'
                }
            ]
        }
    ],


    validarFormularioRegistro: function (e) {
        e.preventDefault();
        let esFormularioValido = true;

        this.validationRules.forEach(rule => {
            const inputElement = document.getElementById(rule.id);
            let errorMessage = '';

            for (const validation of rule.validations) {
                if (validation.check(inputElement.value)) {
                    errorMessage = validation.message;
                    break;
                }
            }

            if (errorMessage) {
                this.mostrarError(rule.errorId, errorMessage);
                esFormularioValido = false;
            } else {
                this.limpiarError(rule.errorId);
            }
        });

        if (esFormularioValido) {
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
            const codigoPromocional = document.getElementById('codigo-promocional').value.trim();

            const nuevoUsuario = { nombre, email, fechaNacimiento, codigoPromocional };

            storage.guardarUsuario(nuevoUsuario);
            mostrarAlertaWeb('¡Registro exitoso! Serás dirigido a tu perfil.');
            this.aplicarDescuentos(email, new Date(fechaNacimiento), codigoPromocional);

            e.target.reset();
            window.location.href = 'perfil.html';
        }
    },

    aplicarDescuentos: function (email, fechaNacimiento, codigoPromocional) {
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        let mensajes = [];

        if (edad >= 50) {
            mensajes.push('¡Felicidades! Obtienes un 50% de descuento por ser mayor de 50 años.');
        }

        if (codigoPromocional === 'FELICES50') {
            mensajes.push('¡Felicidades! Obtienes un 10% de descuento de por vida con el código FELICES50.');
        }

        if (email.endsWith('@duocuc.cl')) {
            mensajes.push('¡Felicidades! Por ser de Duoc UC, recibirás una torta gratis en tu cumpleaños.');
        }

        if (mensajes.length > 0) {
            mostrarAlertaWeb(mensajes.join('\n\n'));
        }
    },

    mostrarError: function (campo, mensaje) {
        const errorElement = document.getElementById(`error-${campo}`);
        if (errorElement) {
            errorElement.textContent = mensaje;
        }
    },

    limpiarError: function (campo) {
        const errorElement = document.getElementById(`error-${campo}`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    },

    inicializar: function () {
        const formularioRegistro = document.getElementById('formulario-registro');
        if (formularioRegistro) {
            formularioRegistro.addEventListener('submit', (e) => this.validarFormularioRegistro(e));
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    validacion.inicializar();
});