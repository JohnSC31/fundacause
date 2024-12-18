// VARIABLES GLOBALES
const URL_PATH = $('body').attr('data-url').replace(/[\\]/gi,'/');
const AJAX_URL = URL_PATH + 'app/controllers/Ajax.php';

(function () {
    "use strict";
  
    document.addEventListener('DOMContentLoaded', function (){
      // Despues de cargar todo el DOM se ejecuta el codigo

      // APERTURA DE LOS MODALS
      $("body").on("click", "[data-modal]", openModal);
      $("body").on("click", "[close-modal]", closeModal);

      // EVENT LISTENER DE FORMULARIOS

      // Registro
      $("body").on("submit", "form#signup-form", userSignUpForm);
      $("body").on("click", "#showPassBtn", showPass);
      // Inicio de sesion
      $("body").on("submit", "form#login-form", userLoginForm);
       // boton de cerrar sesion
       $("body").on("click", "[log-out]", userLogout);
      // Crear proyecto
      $("body").on("submit", "form#new-project-form", newProjectForm);
      // editar un proyecto
      $("body").on("submit", "form#edit-project-form", newProjectForm);

      // agregar dinero a la billetera
      $("body").on("click", "button#add-amount", addUserAmount);

      // hacer una donacion
      $("body").on("click", "button#user-donate", donateProject);
      
      // solicitar mentoria
      $("body").on("submit", "form#mentory-form", requestMentoring);

      // completar mentoria
      $("body").on("click", "[complete-mentorship]", completeMentorship); 
      // eliminar mentoria
      $("body").on("click", "[delete-mentorship]", deleteMentorship);
      
      // registrar usuario a evento
      $("body").on("click", "[register-event]", registerUserEvent); 
      
      // validar un proyecto
      $("body").on("click", "[valid-proyect]", validProject); 
      

      if($("body").attr('id') === "home"){
        loadProyectsHome();
      }

      if($("body").attr('id') === "project"){
        $('#funding').maskMoney();
      }

      if($("body").attr('id') === "signup"){
        // getUsers();
      }

      if($("body").attr('id') === "profile"){
        loadUserDonation();
        loadUserProyects();
        loadProfileMentorships();
        
      }

      if($("body").attr('id') === "events"){
        loadEvents();
      }

      
      
  
    }); // end DOMContentLoaded
  
  
})();

// ///////////////// *******************************  FUNCIONES  ****************************** /////////////////////

async function getUsers(){

  const usersTest = new FormData();
        
  usersTest.append('ajaxMethod', "getUsers");  

  result = await ajaxRequest(usersTest);

  console.log(result.Data);

}
// FUNCION PARA ABRIR Y CARGAR UN MODAL
function openModal(e){
  e.preventDefault();
  const modalName = $(this).attr('data-modal');
  const modalData = $(this).attr('data-modal-data') !== undefined ? JSON.parse($(this).attr('data-modal-data')) : {};

  const myData = {
    'ajaxMethod': 'loadModal',
    'modal': modalName,
    'data': modalData
  }

  $.ajax({
    url: AJAX_URL,
    type:'POST',
    dataType:'html',
    data: myData
  }).done(function(data){
    $('div#modal_container').html(data);
    $('div#modal_container').css('display', 'block'); // estaba en flex
    $('body').css('overflow', 'hidden');
  });
}

// FUNCION PARA CERRAR UN MODAL
function closeModal(e = false){
  if(e) e.preventDefault();
  $('div.modal_container').css('display', 'none');
  $('div#modal_container').html('');
  $('body').css('overflow', 'auto');
  // if($('div.notification')) $('div.notification').remove();
}

// MOSTRAR NOTIFICACION
function showNotification(message, success){
  const notification = $('<div></div>');
  notification.addClass('notification');
  notification.addClass((success) ? 'n_success' : 'n_error');

  const text = $("<p></p>").text(message);

  notification.html(text);
  // insert before toma de paramatros (que insertar, antes de que se insetar)
  $("#notification_container").html("");
  $("#notification_container").html(notification);
  // ocultar y mostrar la notif
  setTimeout(()=>{
      notification.addClass('visible');
      setTimeout(()=>{
        notification.removeClass('visible');
        setTimeout(()=>{
            notification.remove();
        }, 500)   
      }, 3000)   
  }, 100)
}

// FUNCIONES PARA LA VALIDACION DE FORMULARIO
function validInput(input_value, max_length = false, msj = 'Campo Obligatorio'){
  
  if(input_value.length == 0){
    showNotification(msj, false);
    return false;
  }
  if(length > 0 && input_value.length > max_length){
    showNotification("Excede max de caracteres", false);
    return false;
  }

  return true;
  
}

function validPassword(input_value){
  if(input_value.length == 0){
    showNotification("Ingrese una contreseña", false);
    return false;

  }else if (input_value.length < 7) {
    showNotification("Contreseña muy corta", false);
    return false;
  }
  return true
}

function validEmail(input_value){
  const validEmailPattern = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  if(input_value.length == 0){
    showNotification("Ingrese un correo", false);
    return false;
  }
  if (!validEmailPattern.test(input_value)){
    showNotification("Correo inválido", false);
    return false;

  }
  return true;
}

// FUNCIONES DE VALIDACION DE FORMULARIOS
function validPasswords(input_pass, input_confirm_pass){
  if(input_pass.val() === input_confirm_pass.val() && input_pass.val().length >= 7) return true
  
  $('div#div_error').show();
  if(input_pass.val() !== input_confirm_pass.val()) error_msj = 'Las contraseñas no coinciden';
  if(input_pass.val().length <= 6) error_msj = 'La contraseña debe tener al menos 7 caracteres';
  $('p#mensaje_error').text(error_msj);
  $("html, body").animate({
    scrollTop: ErrDivposicion
  }, 500); 
  $(input_pass).css('border-color', 'red');
  $(input_confirm_pass).css('border-color', 'red');
  return false;
}

//mostrar las passwords al ususario
function showPass(e){
  e.preventDefault();
  var action = $(this).attr('data-action');
  var input = $(this).attr('data-input');
  if(action === "show"){
    $("#" + input ).attr('type', 'text');
    $(this).attr('data-action', 'hide');
    $(this).html('<i class="fas fa-eye-slash"></i>');
  }else if(action === 'hide'){
    $("#" + input ).attr('type', 'password');
    $(this).attr('data-action', 'show');
    $(this).html('<i class="fas fa-eye"></i>');
  }
}

//  --------------------------------- REGISTRO ----------------------------------------------
async function userSignUpForm (e){
  e.preventDefault();

  // optienen los campos del formulario
  const input_name = $('input#name');
  const input_idNumber = $('input#idNumber');
  const input_workarea = $('input#workArea');
  const input_phone = $('input#phoneNumber')
  
  const input_email = $('input#email');
  const input_pass = $('input#pass');

  // validan los datos
  if(!validInput(input_name.val(), false, "Ingrese un nombre")) return false;
  if(!validInput(input_idNumber.val(), false, "Ingrese una cedula")) return false;
  if(!validInput(input_workarea.val(), false, "Ingrese un area de trabajo")) return false;
  if(!validInput(input_phone.val(), false, "Ingrese un telefono")) return false;

  
  if(!validEmail(input_email.val())) return false;
  if(!validPassword(input_pass.val())) return false;

  const signupFormData = new FormData();
  signupFormData.append('cedula', input_idNumber.val().replace(/ /g, ''));
  signupFormData.append('name', input_name.val());
  signupFormData.append('email', input_email.val());
  signupFormData.append('areaTrabajo', input_workarea.val());
  signupFormData.append('dineroInicial', '0');
  signupFormData.append('rol', 'usuario');
  signupFormData.append('telefono', input_phone.val().replace(/\-/g, ''));
  signupFormData.append('contrasenna', input_pass.val());
  signupFormData.append('estado', 'Activo');

  signupFormData.append('ajaxMethod', "userSignUp");  

  result = await ajaxRequest(signupFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    setTimeout(()=>{
      window.location.href = URL_PATH + 'home';
    }, 1500)
  }
}

// -------------------------------- INICIO DE SESION --------------------------------
async function userLoginForm(e){
  
  e.preventDefault();
  // campos
  const input_email = $('input#email');
  const input_pass = $('input#pass');
  // validacion
  if(!validEmail(input_email.val())) return false;
  if(!validPassword(input_pass.val())) return false;

  // form data
  const loginFormData = new FormData();
  loginFormData.append('email', input_email.val());
  loginFormData.append('contrasenna', input_pass.val());
  loginFormData.append('ajaxMethod', "userLogin");  

  result = await ajaxRequest(loginFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    setTimeout(()=>{
      window.location.href = URL_PATH + 'home';
    }, 1500)
  }

}

async function userLogout(e){
  e.preventDefault();

  // form data
  const loginFormData = new FormData();
  loginFormData.append('ajaxMethod', "userLogout");  

  result = await ajaxRequest(loginFormData);
  showNotification(result.Message, result.Success, true);

  if(result.Success){
    setTimeout(()=>{
      window.location.href = URL_PATH + 'home';
    }, 1500)
  }
}


//  ------------------------ PROYECTO -------------------------------
async function newProjectForm(e){
  e.preventDefault();

  // campos
  const input_name = $('input#name');
  const input_funding = $('input#funding');
  const input_deadline = $('input#deadline');
  const select_categorie = $('select#select-categorie');
  const textarea_description = $('textarea#description');
  const input_action = $('input#action');

  // validacion
  if(!validInput(input_name.val(), false, "Ingrese un nombre")) return false;
  if(!validInput(input_funding.val(), false, "Ingrese un objetivo de recaudacion")) return false;
  if(!validInput(input_deadline.val(), false, "Ingrese una fecha limite")) return false;

  // validacion fecha futura
  if(!(new Date() < new Date(input_deadline.val()))){
    showNotification("Fecha limite debe ser futura", false);
    return false;
  }
  if($(select_categorie).val() == ""){
    showNotification("Seleccione una categoria", false);
    return false;
  }
  if(!validInput(textarea_description.val())) return false;
  
  // proyecto = {
  //   correoResponsable:	(str, required),
  //   pName:        	(str, required),
  //   descripcion:     	(str, required),
  //   objetivoF:     	(str, required),
  //   montoReca:     	(str, required), (al crearlo 0)
  //   fechaLimite:     	(str, required),
  //   categoriaP:    	(str, required), (estan en la db??)
  //   mediaItems:    	([str], required),(que es esto??)
  //   donaciones:    	([str], required) (vacio?)
  
  // }
  

  // form data
  const projectFormData = new FormData();
  projectFormData.append('pName', input_name.val());
  projectFormData.append('descripcion', textarea_description.val());
  projectFormData.append('objetivoF', input_funding.val());
  projectFormData.append('categoriaP', select_categorie.val());
  projectFormData.append('fechaLimite', input_deadline.val());

 

  if(input_action.val() == 'create')    projectFormData.append('ajaxMethod', "createProject");
  if(input_action.val() == 'edit'){
    projectFormData.append('_id', $('input#idProject').val());
    
    projectFormData.append('ajaxMethod', "editProject");
  }
  
  result = await ajaxRequest(projectFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    if(input_action.val() == 'edit') loadUserProyects(); // se actualiza en la lista
    if(input_action.val() == 'create') window.location.href = URL_PATH + 'profile'; // se actualiza en la lista
  }
}


// --------------- CARGAR TODOS LOS PROYECTOS
async function loadProyectsHome(e = false){
  if(e) preventDefault();

  const formData = new FormData();
  formData.append('ajaxMethod', "loadProyects");  

  result = await ajaxHTMLRequest(formData, 'div#proyects-home-container');
}


// -------------------- CARGAR LOS PROYECTOS DE UN USUARIO
async function loadUserProyects(e = false){
  if(e) e.preventDefault();

  const formData = new FormData();
  formData.append('ajaxMethod', "loadUserProyects");  

  result = await ajaxHTMLRequest(formData, 'div#proyects-profile-container');
}

// ------------------- AGREGAR DINERO A LA BILLETERA
async function addUserAmount(e = false){
  if(e) e.preventDefault();

  // validaciones
  const input_amount = $('input#addAmount');

  if(!$.isNumeric(input_amount.val()) || parseInt(input_amount.val()) <= 0){
    showNotification("Debe ingresar un numero positvo valido", false);
    return;
  }

  const formData = new FormData();
  formData.append('amount', input_amount.val());
  formData.append('ajaxMethod', "addUserAmount"); 
  
  result = await ajaxRequest(formData);
  showNotification(result.Message, result.Success);

  if(result.Success){
    $('span#userAmount').text(result.Data); // se acutaliza el monto
    input_amount.val(''); // se acutaliza el monto
  }
}

// -------------------- DONACION DE USUARIO

async function donateProject(e = false){
  if(e) e.preventDefault();

  // validaciones
  const input_amount = $('input#donation-amount');
  const input_comment = $('input#donation-comment');

  if(!$.isNumeric(input_amount.val()) || parseInt(input_amount.val()) <= 0){
    showNotification("Debe ingresar un numero positvo valido", false);
    input_amount.val('');
    return;
  }

  if(!validInput(input_comment.val())) return;

  const formData = new FormData();
  formData.append('monto', input_amount.val());
  formData.append('proyectoId', $('input#idProject').val());
  formData.append('nombreProyecto', $('input#nameProject').val());
  formData.append('fechaDonacion',new Date(Date.now()).toLocaleDateString());
  formData.append('comentario', input_comment.val());

  formData.append('ajaxMethod', "donateProject"); 

  result = await ajaxRequest(formData);
  showNotification(result.Message, result.Success);

  if(result.Success){
    $('span#userAmount').text(result.Data.wallet); // se acutaliza el monto
    $('span#projectAmount').text(result.Data.newProjectAmount); // se acutaliza el monto
    input_amount.val(''); // se acutaliza el monto
    input_comment.val(''); // se acutaliza el monto
    loadProyectsHome();
  }

}

async function validProject(e = false){
  
  if(e) e.preventDefault();

  const idProject = $(this).attr('valid-proyect');

  
  const formData = new FormData();
  formData.append('id', idProject);
  formData.append('ajaxMethod', "validProject"); 
  
  result = await ajaxRequest(formData);
  showNotification(result.Message, result.Success);

  if(result.Success){

    let checks = $("#checks-container i");

    for(let i = 0; i < checks.length; i++){
      if(!$(checks[i]).hasClass('validated-icon')){
        $(checks[i]).addClass('validated-icon');
        break;
      }
    }
    
  }
}

// ---------------------- DONACIONES -----------------------------------------
async function loadUserDonation(e = false){
  if(e) preventDefault();

  const formData = new FormData();
  formData.append('ajaxMethod', "loadUserDontations");  

  result = await ajaxHTMLRequest(formData, 'div#user-donations-history');
}


// ----------------------- SOLICITAR MENTORIA
async function requestMentoring(e){
  e.preventDefault();

  // optienen los campos del formulario
  const input_mentor_email = $('input#mentor-email');
  const input_date = $('input#date');
  const input_description = $('textarea#description');

  // validan los datos
  if(!validEmail(input_mentor_email.val())) return false;

  if(!validInput(input_date.val(), false, "Ingrese una fecha")) return false;
  // validacion fecha futura
  if(!(new Date() < new Date(input_date.val()))){
    showNotification("La fecha debe ser futura", false);
    return false;
  }

  if(!validInput(input_description.val(), false, "Ingrese una descripcion")) return false;


  const formData = new FormData();
  formData.append('correoMentor', input_mentor_email.val());
  formData.append('descripcion', input_description.val());
  formData.append('precio', "100");
  formData.append('fechayHora', input_date.val());
  formData.append('estado', "Pendiente");
  
  

  formData.append('ajaxMethod', "requestMentoring");  

  result = await ajaxRequest(formData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    // reset form
    $('form#mentory-form')[0].reset();

    // se cargan las mentorias
    loadProfileMentorships();

    // se actualiza la billetera
    $('span#userAmount').text(result.Data);

  }

}


// cargar las mentorias de un mentor en el prefil
async function loadProfileMentorships(){

  const formData = new FormData(); 
  formData.append('ajaxMethod', "loadProfileMentorships");  

  result = await ajaxHTMLRequest(formData, 'div#mentorships-profile-container');
}

// eliminar una mentoria
async function deleteMentorship(e){
  e.preventDefault();

  const formData = new FormData();
  formData.append('id', $(this).attr('delete-mentorship'));
  formData.append('ajaxMethod', "deleteMentorship");  

  result = await ajaxRequest(formData);

  showNotification(result.Message, result.Success, false);

  if(result.Success){
    loadProfileMentorships();
  }
}

async function completeMentorship(e){
  e.preventDefault();

  const formData = new FormData();
  formData.append('id', $(this).attr('complete-mentorship'));
  formData.append('ajaxMethod', "completeMentorship");  

  result = await ajaxRequest(formData);

  showNotification(result.Message, result.Success, false);

  if(result.Success){
    loadProfileMentorships();
  }
}


// --------------- EVENTOS ------------------------

// cargar eventos
async function loadEvents(e = false){
  if(e) preventDefault();

  const formData = new FormData(); 
  formData.append('ajaxMethod', "loadEvents"); 
   

  result = await ajaxHTMLRequest(formData, 'div#events-list-container');
}

async function registerUserEvent(e = false){
  if(e) e.preventDefault();

  const formData = new FormData();
  formData.append('id', $(this).attr('register-event'));
  formData.append('ajaxMethod', "registerUserEvent");  

  result = await ajaxRequest(formData);

  showNotification(result.Message, result.Success, false);

  if(result.Success){
    loadEvents();
  }
}

///////////// ************************ AJAX BACKEND CONN ************************ ///////////////
// FUNCION QUE REALIZA LA CONECCION CON EL BACKEND
// Debe haber un campo en el form data indicando el metodo a utilizar en el ajax controller llamado 'ajaxMethod'
async function ajaxRequest(formData){
  return new Promise(resolve => {
    $.ajax({
      url:'app/controllers/Ajax.php',
      type:'POST',
      processData: false,
      contentType: false,
      data: formData
    }).done(function(data){
      console.log(data);
      resolve(JSON.parse(data));
    });
  });
}

// FUNCION QUE REALIZA LA CONECCION CON EL BACKEND Y RETORNA UN HTML
// Debe haber un campo en el form data indicando el metodo a utilizar en el ajax controller llamado 'ajaxMethod'
// html container indica el contenedor en el cual va ser insertado el html es un string indicando el id
async function ajaxHTMLRequest(formData, html_container){
  $.ajax({
    url: AJAX_URL,
    type:'POST',
    processData: false,
    contentType: false,
    dataType:'html',
    data: formData
  }).done(function(data){
    $(html_container).html(data);
  });
}

  