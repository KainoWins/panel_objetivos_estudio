
// Clave del localStorage
const LOCAL_STORAGE_KEY = "datosJson";

// Función para cargar datos desde localStorage o desde un archivo JSON cargado
function cargarDatos() {
  const datosGuardados = localStorage.getItem(LOCAL_STORAGE_KEY);
  return datosGuardados ? JSON.parse(datosGuardados) : [];
}

// Función para guardar datos en localStorage
function guardarDatos(datos) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datos));
}

// Función para eliminar datos del localStorage usando el id y refrescar la página
function eliminarDatosPorId(id) {
    // Obtener los datos actuales de localStorage
    let datos = JSON.parse(localStorage.getItem("datosJson")) || []; // Usa un array vacío si no hay datos
  
    // Filtrar el array para eliminar el objeto con el id especificado
    const nuevosDatos = datos.filter((objeto) => objeto.id !== id);
  
    // Guardar los datos actualizados en localStorage
    localStorage.setItem("datosJson", JSON.stringify(nuevosDatos));
  
    // Refrescar la página para que se reflejen los cambios
    location.reload();
  }

  function generarKeyUnica() {
    const timestamp = Date.now().toString(36); // Convierte la fecha actual en base 36
    const randomNumber = Math.random().toString(36).substring(2, 8); // Número aleatorio en base 36
    return `${timestamp}-${randomNumber}`; // Combina ambas partes
  }

  // Función para modificar el texto del objeto en el localStorage y recargar el DOM
function modificarTextoPorId(id) {
  let datos = JSON.parse(localStorage.getItem("datosJson")) || [];

  // Encontrar el objeto a modificar
  const objeto = datos.find((obj) => obj.id === id);

  if (objeto) {
    // Pedir al usuario un nuevo valor para el texto
    const nuevoTexto = prompt("Ingrese el nuevo texto:", objeto.texto);

    // Si el usuario ingresó un texto nuevo, actualizar el objeto y el localStorage
    if (nuevoTexto !== null) {
      objeto.texto = nuevoTexto; // Actualizar el texto

      // Guardar los datos actualizados en localStorage
      localStorage.setItem("datosJson", JSON.stringify(datos));

      // Recargar los datos en el DOM
      cargarJSON();
    }
  } else {
    console.warn("No se encontró el objeto con el id especificado.");
  }
}


// Función para cargar los datos en el HTML
function cargarJSON() {
  const datos = cargarDatos(); 

  // Limpiar el contenido actual
  document.querySelectorAll(".json-box").forEach((box) => box.remove());

  // Crear las cajas a partir del JSON
  datos.forEach((objeto) => {
    const caja = document.createElement("div");
    caja.classList.add("json-box");
    caja.id = objeto.id;

    const titulo = document.createElement("div");
    titulo.classList.add("json-title");
    titulo.textContent = objeto.titulo;

    // Usar una función de flecha para que el alert se ejecute solo al hacer doble clic
    titulo.addEventListener("dblclick", () => eliminarDatosPorId(objeto.id));

    const texto = document.createElement("div");
    texto.classList.add("json-text");
    texto.textContent = objeto.texto;

    // Evento de doble clic para modificar el texto del objeto
    texto.addEventListener("dblclick", () => modificarTextoPorId(objeto.id));

    caja.appendChild(titulo);
    caja.appendChild(texto);

    const panelContenido = document.getElementById("panelContenido");
    panelContenido.appendChild(caja);

    // document.body.appendChild(panelContenido);
  });
}

// Función para agregar un nuevo objeto al JSON
function agregarObjeto() {
  const tituloInput = document.getElementById("titulo").value;
  const textoInput = document.getElementById("texto").value;

  if (tituloInput && textoInput) {
    const datos = cargarDatos();

    const nuevoObjeto = {
        id: generarKeyUnica() ,
      titulo: tituloInput,
      texto: textoInput,
    };

    datos.push(nuevoObjeto);

    guardarDatos(datos);

    cargarJSON();

    document.getElementById("titulo").value = "";
    document.getElementById("texto").value = "";
  } else {
    alert("Por favor, ingresa tanto el título como el texto.");
  }
}

// Función para descargar el contenido de localStorage como un archivo JSON
function descargarJSON() {
  const datos = cargarDatos();
  const jsonString = JSON.stringify(datos, null, 4);

  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");

  const fecha = new Date();
  const fechaFormateada =
    fecha.getFullYear().toString() +
    (fecha.getMonth() + 1).toString().padStart(2, "0") +
    fecha.getDate().toString().padStart(2, "0");

  link.download = `${fechaFormateada}_datos.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
}

// Función para cargar el contenido de un archivo JSON al localStorage
function cargarArchivo(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const datos = JSON.parse(e.target.result);
      guardarDatos(datos); // Guardar los datos del archivo en localStorage
      cargarJSON(); // Cargar los datos en la página
      // alert("Archivo JSON cargado correctamente.");
    } catch (error) {
      alert("Error al leer el archivo JSON.");
    }
  };

  if (file) {
    reader.readAsText(file);
  }
}

// Cargar los datos al iniciar la página
window.onload = function () {
  cargarJSON();
};
