// ================= CRUD tareas ====================

const $entrada = document.querySelector('#tarea');
const $boton = document.querySelector('#agregar');
const $ul = document.querySelector('#lista-tareas');
const $ul_completadas = document.querySelector('#lista-tareas-completadas');
const $nothing = document.querySelector('#nothing');
const $nothingComplete = document.querySelector('#nothing-complete');

//============== Añadir tareas ==================
$boton.addEventListener('click', (e) => {
    
    e.preventDefault();

    const tarea = $entrada.value;

    if (tarea !== "") {
        const li = document.createElement("li");
        li.classList.add("d-flex", "align-items-center", "ms-0", "fade-in");

        const check = document.createElement("input");
        check.classList.add("form-check-input", "me-2", "col-2");

        const p = document.createElement("p");
        p.classList.add("m-0", "me-3", "ms-1", "fs-5");

        check.type="checkbox";
        p.textContent = tarea;

        li.appendChild(check);
        li.appendChild(p);
        li.appendChild(modificarTarea(p, check));
        li.appendChild(borrarTarea());
        $ul.appendChild(li);

        $nothing.style.display = "none";
        $entrada.value="";
    }
});

//============= Borrar Tareas ================

function borrarTarea() {

    const del = document.createElement("button");
    del.classList.add("borrar", "btn", "m-2", "btn-sm");
    del.setAttribute('aria-label', 'borrar la tarea seleccionada');

    const icon_del = document.createElement("i");
    icon_del.classList.add('fa-solid', 'fa-trash');
    del.appendChild(icon_del);


    del.addEventListener('click', (e)=>{

        const bg = document.querySelector("body").getAttribute("data-bs-theme");
        
        if (bg === "dark") {
            fondo = "oscuro";
        } else if (bg === "light") {
            fondo = "claro";
        }

        Swal.fire({

            title: '¿Estás seguro de eliminar esta tarea?',
            html: "¡Esta acción es <b>irreversible</b>!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#ff0000',
            confirmButtonText: 'Si, continuar',
            confirmButtonAriaLabel: 'Confirmar la acción de eliminar tarea seleccionada',
            cancelButtonText: 'No, cancelar',
            confirmButtonAriaLabel: 'Confirmar la acción de eliminar tarea seleccionada',
            reverseButtons: true,
            customClass: {
                popup: 'fondo-' + fondo
              }

          }).then((result) => {
            if (result.isConfirmed) {
                const elemento = e.target.parentElement;
                etiqueta = elemento.tagName;

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'fondo-' + fondo
                      }
                  })
                  
                  Toast.fire({
                    icon: 'success',
                    title: '¡Tarea eliminada exitosamente!',
                    
                  })
    
                if (etiqueta == "LI") {
                    
                    const lista = elemento.parentElement;
                    lista.removeChild(elemento);
    
                } else if(etiqueta == "BUTTON") {
    
                    const elemento_final = elemento.parentElement;
                    const lista = elemento_final.parentElement;
                    lista.removeChild(elemento_final);
                    
                }
                const listaCompletadas = $ul_completadas.querySelectorAll('li');

                    if (listaCompletadas.length < 1) {

                        $nothingComplete.style.display = "block";
                    }   
            
                const lista = $ul.querySelectorAll('li');

                    if (lista.length < 1) {
                        $nothing.style.display = "block";
                    } else{
                        $nothing.style.display = "none";
                    }

            }
          });


    });
    return del;
}

//======================== Editar Tareas ============================

function modificarTarea(p, check) {

    const mod = document.createElement("button");
    mod.classList.add("modificar", "btn", "btn-sm");
    mod.setAttribute('aria-label', 'Modificar texto de la tarea seleccionada');

    const icon_mod = document.createElement("i");
    icon_mod.classList.add('fa-solid', 'fa-pen-to-square');
    mod.appendChild(icon_mod);

    mod.addEventListener('click', (e)=>{
        
        const input = document.createElement("input");
        input.classList.add("tareaActualizada", "me-3", "col-sm-10", "col-lg-", "col-md-");

        check.disabled = true;

        input.value = p.textContent;
        p.replaceWith(input);

        const padre = input.parentNode;
        const del = padre.querySelector(".borrar");

        padre.appendChild(actualizar(input, p, padre, mod, del, check));
        
        mod.style.display="none";
        del.style.display="none";

        padre.appendChild(cancelar(p, input, mod, del, padre, check));

    });

    return mod;
}

function actualizar(input, p, padre, mod, del, check) {
    
    const actualizar = document.createElement("button");
    actualizar.classList.add("actualizar", "btn", "btn-sm", "me-2");
    actualizar.setAttribute('aria-label', 'Confirmar el cambio en la tarea seleccionada');

    const icon_upd = document.createElement("i");
    icon_upd.classList.add('fa-solid', 'fa-arrow-up-from-bracket');
    actualizar.appendChild(icon_upd);

    actualizar.addEventListener('click', (e)=>{
        p.textContent = input.value;
        input.replaceWith(p);

        actualizar.remove();
        check.disabled = false;

        const cancelar = padre.querySelector(".cancelar");
        cancelar.remove();

        mod.style.display="inline-block";
        del.style.display="inline-block";

        

    });

    return actualizar;
}

function cancelar(p, input, mod, del, padre, check) {

    const cancelar = document.createElement("button");
    cancelar.classList.add("cancelar", "btn", "borrar", "btn-sm");
    cancelar.style.display="inline-block";
    cancelar.setAttribute('aria-label', 'Cancelar la acción de modificar tarea');

    const icon_can = document.createElement("i");
    icon_can.classList.add('fa-solid', 'fa-xmark');
    cancelar.appendChild(icon_can);

    cancelar.addEventListener('click', (e)=>{

        const actualizar = padre.querySelector(".actualizar");
        input.replaceWith(p);
        cancelar.remove();
        actualizar.remove();
        check.disabled = false;
        mod.style.display="inline-block";
        del.style.display="inline-block";
        
    });

    return cancelar;
}

//==================== Marcar y descmarcar tareas =========================

$ul.addEventListener('change', (e) => {

    const checkbox = e.target;
    const tarea = checkbox.nextElementSibling;
    if (checkbox.checked) {
        
        const tareaCheck = checkbox.parentElement;
        tareaCheck.remove();
        $ul_completadas.appendChild(tareaCheck);
        tarea.style.textDecoration = "line-through";
        $nothingComplete.style.display = "none";        
        
        const padreModificar = e.target.parentElement;
        const modificar = padreModificar.querySelector(".modificar");

        modificar.style.display = "none";

    }

    const listaComplete = $ul_completadas.querySelectorAll('li');

            if (listaComplete.length < 1) {
                $nothingComplete.style.display = "block";
            }   
            
    const lista = $ul.querySelectorAll('li');

            if (lista.length < 1) {
                $nothing.style.display = "block";
            }  

});

$ul_completadas.addEventListener('change', (e) => {

    const checkbox = e.target;
    const tarea = checkbox.nextElementSibling;

    if (checkbox.checked === false) {
        
        const tareaCheck = checkbox.parentElement;
        tareaCheck.remove();
        tarea.style.textDecoration = "none";
        $ul.appendChild(tareaCheck);

        const padreModificar = e.target.parentElement;
        const modificar = padreModificar.querySelector(".modificar");

        modificar.style.display = "block";

    }

    const listaCompletadas = $ul_completadas.querySelectorAll('li');

            if (listaCompletadas.length < 1) {
                $nothingComplete.style.display = "block";
            }   
            
    const lista = $ul.querySelectorAll('li');

            if (lista.length < 1) {
                $nothing.style.display = "block";
            } else{
                $nothing.style.display = "none";
            }

});


// =============== Aplicar fondo oscuro o claro =================

const fondoOscuro = () => {
    document.querySelector("body").setAttribute("data-bs-theme","dark");
    document.querySelector("#f-icon").setAttribute("class","fa-solid fa-sun fs-4 text-light");
}

const fondoClaro = () => {
    document.querySelector("body").setAttribute("data-bs-theme","light");
    document.querySelector("#f-icon").setAttribute("class","fa-solid fa-moon fs-4 text-light");
}

const cambiarFondo = () => {
    document.querySelector("body").getAttribute("data-bs-theme") === "light"?
    fondoOscuro() : fondoClaro();
}

// ======================= Alerta de bienvenida ==========================

Swal.fire({
    title: '¡Bienvenido!',
    html: '<h2>😀</h2>',
    timer: "2000",
    timerProgressBar: true,
    showConfirmButton: false
  })

