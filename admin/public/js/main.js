// VARIABLES GLOBALES
const URL_PATH = $('body').attr('data-url').replace(/[\\]/gi,'/');
const AJAX_URL = URL_PATH + 'app/controllers/Ajax.php';

(function () {
    "use strict";
  
    document.addEventListener('DOMContentLoaded', function (){
      // Despues de cargar todo el DOM se ejecuta el codigo

      //LOGIN
      $("body").on("submit", "form#admin-login-form", loginAdmin);
      //LOGOUT
      $("body").on("click", "[data-admin-logout]", logoutAdmin);
      // CREATE ADMIN
      $("body").on("submit", "form#create-admin-form", createAdmin);

      $("body").on("submit", "form#create-event-form", createEvent);
      
      
      // ACCIONES DE LOS USUARIOS
      $("body").on("click", "[user-action]", userAction);
      

      // APERTURA DE LOS MODALS
      $("body").on("click", "[data-modal]", openModal);
      $("body").on("click", "[close-modal]", closeModal);

      // NAVEGACION DE ADMINISTRACION
      adminNavigation($('[data-admin-nav="stats"]'));

      $("body").on("click", "[data-admin-nav]", function(e){
        e.stopPropagation();
        adminNavigation(e.currentTarget);
      });

      $('input#price').maskMoney();

      
      
  
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
    // console.log(data);
    $('div#modal_container').html(data);
    $('div#modal_container').css('display', 'block'); // estaba en flex
    $('body').css('overflow', 'hidden');

    // acciones para los modals
    if(modalName === "employee"){
      loadModalEmployeePaids();
    }
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

// Funcionalidad para mostrar la notificacion
///////////// ************************ NOTIFICACION ************************ ///////////////
function showNotification(message, success, timer = true){
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
        if(timer){ // si timer entonces de deshace sola
          notification.removeClass('visible');
          setTimeout(()=>{
            notification.remove();
          }, 500)
        }    
      }, 3000)   
  }, 100)
}

// FUNCIONES PARA LA VALIDACION DE FORMULARIO
// validar inputs comunes
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
// validar contrasenas
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
// validar correos
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
// valida archivos
function validFiles(fileInput){

  if(fileInput[0].files.length == 0){
    showNotification("Ingrese al menos una imagen", false);
    return false
  }

  for (var i = 0; i < fileInput[0].files.length; i++){
    
    if (fileInput[0].files[i] && fileInput[0].files[i].size < 2000000){ 
      return true;
    }
    var msjError;
    if(!fileInput[0].files[i]) msjError = 'Selecciona un archivo';

    if(fileInput[0].files[i] && fileInput[0].files[i].size > 2000000) msjError = 'El archivo seleccionado es muy grande';
    showNotification(msjError, false);
    return false;

  }

  
  
}

///////////// **************************************************************************************************** ///////////////
///////////// ********************************************** ADMIN AREA ****************************************** ///////////////
///////////// **************************************************************************************************** ///////////////

// FUNCION PARA INICIAR SESION DE ADMINSITRADOR
async function loginAdmin(e){
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
  loginFormData.append('ajaxMethod', "adminLogin");  

  result = await ajaxRequest(loginFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    setTimeout(()=>{
      window.location.href = URL_PATH + 'home';
    }, 1500)
  }
}

// CERRAR SESION DE ADMINSITRADOR
async function logoutAdmin(e){
  e.preventDefault();

  const logoutFormData = new FormData();
  logoutFormData.append('ajaxMethod', "adminLogout");  

  result = await ajaxRequest(logoutFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    setTimeout(()=>{
      window.location.href = URL_PATH + 'login';
    }, 1500)
  }
}

// FUNCION PARA LA INICIALIZACION DE LAS DATATABLES
// ///////////////////////----------------------AJAX TABLE LOADES/ CARGADOR PARA LAS TABLAS AJAX ---------------------////////////////////////////
function initDataTable(table, ajaxMethod){
  const columns = getDataTableColumns(table);
  $("#"+table+"-table").DataTable({
    "responsive": true,
    "autoWidth": false,
    "processing": true,
    "serverSide": true,
    "ajax":{
      url: AJAX_URL,
      type:"POST",
      data: {ajaxMethod: ajaxMethod, table:table}
    },
    "columns": columns
  });
}

// FUNCION PARA OBTENER LAS COLUMNAS DE LAS DATATABLES
function getDataTableColumns(table){
  var columns = new Array();
  //COLS PARA VENTAS
  if(table === 'sells') columns = [{data: 'idSell'}, {data: 'clientName'}, {data: 'status'}, {data: 'date'}];

  // COLS PARA INVENTARIO
  if(table === 'inventory') columns = [{data: 'id'}, {data: 'name'}, {data: 'categorie'}, {data: 'price'}, {data: 'amount'}];

  // COLS PARA RECURSOS HUMANOS
  if(table === 'rrhh') columns = [{data: 'name'}, {data: 'email'}, {data: 'country'}, {data: 'rol'}, {data: 'department'}];

  // COLS PARA SERVICIO AL CLIENTE
  if(table === 'service') columns = [{data: 'client'}, {data: 'type'}, {data: 'employee'}, {data: 'date'}, {data: 'idOrder'}];

  //PARA LAS ACCIONES
  columns.push({data: 'actions', "orderable": false });

  return columns;
}

//RECARGAR LAS DATA TABLES
function refreshDataTables(table){
  $("#"+table+"-table").DataTable().ajax.reload();
}

// Funcionalidad de navegacion para el area de administracion
function adminNavigation(option){
  // style para el hover del menu
  if(!$(option).hasClass("active")){
    // se quita el active de todos y se coloca al actual
    $("ul#admin_nav li").removeClass("active");
    $(option).addClass("active")
  }
  // se ocultan todos los div
  $('div#dashboard_container > div').css('display', 'none');
  // se muestra el div correspondiente
  $('div#dashboard_container div.'+ $(option).attr("data-admin-nav") + '_container').css('display', 'block');

  // ACCIONES PARA LAS SECCIONES
  if($(option).attr("data-admin-nav") === 'stats'){
    loadStats();
  }

  if($(option).attr("data-admin-nav") === 'projects'){
    loadAdminProyects();
  }
  

  if($(option).attr("data-admin-nav") === 'users'){
    // se cargan los administradores
    loadUsers();
  }
  
  if($(option).attr("data-admin-nav") === 'admins'){
    // se cargan los administradores
    loadAdmins();
  }

  if($(option).attr("data-admin-nav") === 'donations'){
    loadDonations();
  }

  if($(option).attr("data-admin-nav") === 'events'){
    // se cargan los administradores
    loadEvents();
  }
  
}

// ------------------------- CARGAR A LOS USUARIOS
async function loadUsers(e = false){
  if(e) preventDefault();

  const formData = new FormData();
  formData.append('rols', JSON.stringify(new Array("usuario", "mentor"))); 
  formData.append('ajaxMethod', "loadUsers"); 
   

  result = await ajaxHTMLRequest(formData, 'div#users-list-container');
}


// ---------------------- ACCIONES PARA LOS USAURIOS
async function userAction(e){
  e.preventDefault();
  action = $(this).attr('user-action');

  const formData = new FormData();

  // se desactiva el usuario
  if(action === 'desactivate'){
    formData.append('correo', $(this).attr('user-data')); 
    formData.append('ajaxMethod', "desactivateUser"); 
  }

  // se activa el usuario
  if(action === 'activate'){
    formData.append('correo', $(this).attr('user-data'));
    formData.append('ajaxMethod', "activateUser"); 
  }

  // se elimina el usuario
  if(action === 'delete'){
    if(!confirm('Desea eliminar al usuario permanentemente')) return;
    formData.append('id', $(this).attr('user-data'));
    formData.append('ajaxMethod', "deleteUser"); 
  }

  // hacer mentor
  if(action === 'mentor'){
    formData.append('email', $(this).attr('user-data'));
    formData.append('ajaxMethod', "makeUserMentor"); 
  }

  result = await ajaxRequest(formData);

  showNotification(result.Message, result.Success);

  if(result.Success){
    loadUsers();
  }
}

// --------------------- CARGAR A LOS ADMINISTRADORES -----------------------------------
async function loadAdmins(e = false){
  if(e) preventDefault();

  const formData = new FormData();
  formData.append('rols', JSON.stringify(new Array("admin"))); 
  formData.append('ajaxMethod', "loadUsers"); 

  result = await ajaxHTMLRequest(formData, 'div#admin-list-container');
}

// ------------------------- CREAR UN ADMINISTRADOR
async function createAdmin (e){
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
  signupFormData.append('rol', 'admin');
  signupFormData.append('telefono', input_phone.val().replace(/\-/g, ''));
  signupFormData.append('contrasenna', input_pass.val());
  signupFormData.append('estado', 'Activo');

  signupFormData.append('ajaxMethod', "createAdmin");  

  result = await ajaxRequest(signupFormData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    $('form#create-admin-form')[0].reset();
    loadAdmins();
  }
}

// --------------------- CARGAR LAS DONACIONES -----------------------------------
async function loadDonations(e = false){
  if(e) preventDefault();

  const formData = new FormData(); 
  formData.append('ajaxMethod', "loadDonations"); 

  result = await ajaxHTMLRequest(formData, 'div#donations-list-container');
}

// ---------------- CARGAR LAS ESTADISTICAS
async function loadStats(e = false){
  if(e) e.preventDefault();

  const formData = new FormData();

  formData.append('ajaxMethod', "loadStats");  

  result = await ajaxRequest(formData);

  if(!result.Success) showNotification(result.Message, result.Success, false);

  $('p#users-stat').text(result.Data.users);
  $('p#projects-stat').text(result.Data.projects);
  $('p#donations-stat').text(result.Data.donations);


}

// --------------- CARGAR TODOS LOS PROYECTOS
async function loadAdminProyects(e = false){
  if(e) preventDefault();

  const formData = new FormData();
  formData.append('ajaxMethod', "loadAdminProyects");  

  result = await ajaxHTMLRequest(formData, 'div#projects-list-container');
}

// ---------------------- CREAR UN EVENTO
async function createEvent(e){
  e.preventDefault();

  // campos
  const input_name = $('input#event-name');
  const input_date = $('input#event-date');
  // const input_price = $('input#price');

  const select_modality = $('select#select-modality');
  const textarea_description = $('textarea#description');

  // validacion
  if(!validInput(input_name.val(), false, "Ingrese un nombre")) return false;
  // if(!validInput(input_price.val(), false, "Ingrese un objetivo de recaudacion")) return false;
  if(!validInput(input_date.val(), false, "Ingrese una fecha limite")) return false;

  // validacion fecha futura
  if(!(new Date() < new Date(input_date.val()))){
    showNotification("Fecha limite debe ser futura", false);
    return false;
  }
  if($(select_modality).val() == ""){
    showNotification("Seleccione una modalidad", false);
    return false;
  }
  if(!validInput(textarea_description.val())) return false;


  // form data
  const formData = new FormData();
  formData.append('descripcion', input_name.val());
  formData.append('fechaHora', input_date.val());
  formData.append('modalidad', select_modality.val());
  formData.append('materiales', textarea_description.val());


  formData.append('ajaxMethod', "createEvent");

  result = await ajaxRequest(formData);
  showNotification(result.Message, result.Success, false);

  if(result.Success){
    $('form#create-event-form')[0].reset();
    loadEvents(); // se actualiza en la lista
  }
}

// cargar eventos
async function loadEvents(e = false){
  if(e) preventDefault();

  const formData = new FormData(); 
  formData.append('ajaxMethod', "loadEvents"); 
   

  result = await ajaxHTMLRequest(formData, 'div#events-list-container');
}

// eliminar un evento
// async function deleteEvent(){
//   if(!confirm('Desea eliminar el evento permanentemente')) return;
//   // form data
//   const formData = new FormData();

//   formData.append('ajaxMethod', "deleteEvent");

//   result = await ajaxRequest(formData);
//   showNotification(result.Message, result.Success, false);

//   if(result.Success){
//     loadEvents(); // se actualiza en la lista
//   }

// }

///////////// ************************ AJAX BACKEND CONN ************************ ///////////////
// FUNCION QUE REALIZA LA CONECCION CON EL BACKEND
// Debe haber un campo en el form data indicando el metodo a utilizar en el ajax controller llamado 'ajaxMethod'
async function ajaxRequest(formData){
  return new Promise(resolve => {
    $.ajax({
      url:AJAX_URL,
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


  