import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener('DOMContentLoaded', ()=>{
    const skills = document.querySelector('.lista-conocimientos');
    if(skills){
        skills.addEventListener('click', agragarSkills)
    }

    //Limpiar alertas
    let alertas = document.querySelector('.alertas')
    if (alertas){
        limpiarAlertas()
    }

    const listadoVacantes = document.querySelector('.panel-administracion')
    if(listadoVacantes){
        listadoVacantes.addEventListener('click', accionesListado)
    }
})

const skills = new Set()
const agragarSkills = (e) => {
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //Quitar el color y sacar del set
            skills.delete(e.target.textContent)
            e.target.classList.remove('activo')    
        }else{
            //Colorearlo y agregar a set
            skills.add(e.target.textContent)
            e.target.classList.add('activo')
        }
    }
    document.querySelector('#skills').value = [...skills]

}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas')
    setInterval(() => {
        if(alertas.children.length > 0){
            alertas.removeChild(alertas.children[0])
        }
    }, 5000);

}

const accionesListado = e =>{
    e.preventDefault()

    if(e.target.dataset.eliminar){
        Swal.fire({
            title: 'Eliminar la vacante?',
            text: "Una vez eliminada no podras recuperarla.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
        }).then((result) => {
            if (result.value) {
                //Eliminar vacante con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                axios.delete(url, {params:{url}})
                    .then(function(respuesta){
                        if(respuesta.status === 200){
                            Swal.fire(
                                'Eliminada!',
                                respuesta.data,
                                'success'
                            )      
                            //Elimino del DOM
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
                        }
                    }).catch(()=>{
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No fue posible elimiar la vacante',
                        })
                    })


            }
        })
    }else if(e.target.tagName === 'A'){
        window.location.href = e.target.href
    }
}