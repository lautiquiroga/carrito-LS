// script que sirve para agregar elementos (cursos) en el menú desplegable del Carrito de compras, eliminarlos y/o vaciar el carrito. Contiene LocalStorage.



// Variables

const carrito = document.querySelector("#carrito");

const contenedorCarrito = document.querySelector("#lista-carrito tbody");

const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");

const listaCursos = document.querySelector("#lista-cursos"); //contenedor de todos los cursos

let articulosCarrito = []; //La declaramos ahora pero la inicializamos más adelante.










// Event Listeners
cargarEventListeners();

function cargarEventListeners() {
  // Imprimir los datos del localStorage:
  document.addEventListener('DOMContentLoaded', () => {
    articulosCarrito = JSON.parse(localStorage.getItem('carrito') || []);
    carritoHTML();
  });

  listaCursos.addEventListener("click", agregarCurso);

  // Eliminar cursos del carrito
  carrito.addEventListener('click', eliminarCurso);

  // Vaciar carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = [];
    limpiarHTML();
  });
}










// Funciones

function agregarCurso(e) {
// Crea una variable que se refiere al curso seleccionado.
// Se ejecuta al hacer click en un curso.

  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) { // Solamente si se clickea el botón "Agregar al Carrito"...
    const cursoSeleccionado = e.target.parentElement.parentElement; // Se crea una nueva variable que se refiere al curso seleccionado.
    leerDatosCurso(cursoSeleccionado); // Ejecuta la función leerDatosCurso.
  }
} 






function leerDatosCurso(curso) {
// Registra, en un nuevo objeto, el contenido HTML del curso clickeado.
// Se ejecuta en la función agregarCurso.

  // 1ro se crea un objeto con el contenido del curso al que le dimos click en el botón:
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  

  // 2do, revisa si un elemento ya existe en el carrito y agrega el objeto infoCurso al array articulosCarrito:
  // Analiza solamente al nuevo elemento:
  const existe = articulosCarrito.some(elemento => elemento.id === infoCurso.id); 

  if(!existe){
  // Si el curso clickeado NO existe en el array articulosCarrito, añade el nuevo objeto al array:
    articulosCarrito = [...articulosCarrito, infoCurso];
  } else {
  // Si el curso clickeado SÍ existe en el array articulosCarrito, incrementa la propiedad 'cantidad' de ese curso:
    const cursos = articulosCarrito.forEach(elemento => {
      if(elemento.id === infoCurso.id){
        elemento.cantidad++;
        return elemento;
      }
    });
  }


  // 3ro, ejecuta la siguiente función:
  carritoHTML(); 
}






function carritoHTML() {
// Coloca las propiedades del objeto recíen creado en el menú desplegable del Carrito:
// Se ejecuta en la función leerDatosCurso.

  // 1ro, limpia el Carrito.
  limpiarHTML();

  // 2do, crea código HTML para mostrar (en la web) las propiedades de los cursos clickeados.
  articulosCarrito.forEach( articulo => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td> <img src=${articulo.imagen} width="100" > </td>
      <td style="text-align: center"> ${articulo.titulo} </td>
      <td style="text-align: center"> ${articulo.precio} </td>
      <td style="text-align: center">  ${articulo.cantidad} </td>
      <td> <a href="#" class="borrar-curso" data-id="${articulo.id}" > X </a> </td>
    `;

    // 3ro, agrega el recíen creado código HTML, en la etiqueta <tbody></tbody> 
    contenedorCarrito.appendChild(row);
  });

  // Agregar el carrito al localStorage:
  sincronizarStorage();
}






function sincronizarStorage(){
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}






function limpiarHTML(){
// Limpia el HTML del menú desplegable del Carrito para que no se repita el array articulosCarrito cada vez que clickeamos un nuevo curso.
// Se ejecuta al inicio de la función carritoHTML.

  // Forma lenta:
  // contenedorCarrito.innerHTML = '';

  // Forma rápida:
  while(contenedorCarrito.firstChild){
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}






function eliminarCurso(e){
// Elima los cursos del carrito al tocar la X
// Se ejecuta al hacer click en el menú desplegable del carrito.

  if (e.target.classList.contains("borrar-curso")) {
  // Solamente se ejecuta el siguiente código si se da click sobre la clase "borrar-curso" (en el botón X).

    // el botón X tiene el mismo id que el curso al que pertenece, por lo tanto, necesitamos obtener el id del botón X para compararlo con los id de todos los cursos del array articulosCarrito...
    const cursoId = e.target.getAttribute('data-id');

    // Filtro: solo quedarán los elementos que NO tengan su id igual al de la X...
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

    // Actualizamos el HTML con el nuevo array...
    carritoHTML();
  }
}




