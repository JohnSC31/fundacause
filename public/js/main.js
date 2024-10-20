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
      // Crear proyecto
      $("body").on("submit", "form#new-project-form", newProjectForm);
      if($("body").attr('id') === "project"){
        $('#funding').maskMoney();
      }
    
  
    }); // end DOMContentLoaded
  
  
})();

// ///////////////// *******************************  FUNCIONES  ****************************** /////////////////////
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
  signupFormData.append('name', input_name.val());
  signupFormData.append('idNumber', input_idNumber.val());
  signupFormData.append('workarea', input_workarea.val());
  signupFormData.append('phone', input_phone.val());

  signupFormData.append('email', input_email.val());
  signupFormData.append('pass', input_pass.val());
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
  loginFormData.append('pass', input_pass.val());
  loginFormData.append('ajaxMethod', "userLogin");  

  result = await ajaxRequest(loginFormData);
  showNotification(result.Message, result.Success, false);

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
  

  // form data
  const projectFormData = new FormData();
  projectFormData.append('name', input_name.val());
  projectFormData.append('funding', input_funding.val());
  projectFormData.append('deadline', input_deadline.val());
  projectFormData.append('categorie', select_categorie.val());
  projectFormData.append('description', textarea_description.val());

  projectFormData.append('ajaxMethod', "createProject");  

  result = await ajaxRequest(projectFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    setTimeout(()=>{
      window.location.href = URL_PATH + 'profile';
    }, 1500)
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

  