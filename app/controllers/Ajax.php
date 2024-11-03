<?php 
    // CONTROLLADOR PARA LAS PETICIONES AJAX Y CONECIONES CON LA BASE DE DATOS
    if (!$_SERVER['REQUEST_METHOD'] === 'POST') { // se verifica que sea una peticion autentica
	    die('Invalid Request');
    }

    require_once '../config.php';
    require_once '../lib/Api.php';



    class Ajax {
        private $controller = "Ajax";
        private $ajaxMethod;
        private $data;
        private $api;

        public function __construct(){

            $this->ajaxMethod = isset($_POST['ajaxMethod']) ? $_POST['ajaxMethod'] : NULL ;
            unset($_POST['ajaxMethod']);

            $this->data = [$_POST];

            if(method_exists($this->controller, $this->ajaxMethod)){
                call_user_func_array([$this->controller, $this->ajaxMethod], $this->data);
            }else{
                $this->ajaxRequestResult(false, "Metodo inexistente");
            }
        }

        //E: bool, str
        //S: none
        // Metodo para enviar las respuestas de ajax al js mediante un echo
        private function ajaxRequestResult($success = false, $message = 'Error desconocido', $dataResult = NULL){
            $result = array(
                'Success' => $success,
                'Message' => $message,
                'Data'    => $dataResult
            );
            echo json_encode($result);
        }

        // Metodo para la carga de los modals
        private function loadModal($data){
            require_once '../config.php';
            require_once '../views/modals/'. $data['modal'] . '.php';
        }

        // Registro de cliente
        private function userSignUp($user){

            // Registro en la base de datos
            $api = new Api('/usuarios/', 'POST', $user);
            $api->callApi();
            
            // iniciar sesion

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha registrado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function userLogin($user){
            // verificar credenciales 
            $api = new Api('/autenticacion/', 'POST', $user);
            $api->callApi();
            // establecer la sesion
            if($api->getStatus() === 200){
                
                $userSession = $api->getResult()['mensaje'];

                $userSession['SESSION'] = true;
                if(isset($userSession['contrasenna'])) unset($userSession['contrasenna']);

                $_SESSION['USER'] = $userSession;
    
                if(isset($_SESSION['USER'])){
                    // retorna sin errores
                    $this->ajaxRequestResult(true, "Se ha iniciado sesión correctamente");
                }else{
                    $this->ajaxRequestResult(false, "Se ha producido un error al iniciar sesión");
                }
            }else{
                $this->ajaxRequestResult(false, $api->getResult()['mensaje']);
            }
            
            $api->close();

        }

        private function userLogout(){
            unset($_SESSION['USER']); 

            if(!isset($_SESSION['USER'])){
              
                $this->ajaxRequestResult(true, "Se ha cerrado la sesión");
            }else{ 
                $this->ajaxRequestResult(false, "Se ha producido un error al cerrar sesión");
            }
        }

        private function createProject($project){
            // Se crea el proyecto


            $project['correoResponsable'] = $_SESSION['USER']['email'];
            $project['montoReca'] = '0';
            $project['mediaItems'] = [];
            $project['donaciones'] = [];
            $project['estado'] = 'Activo';
            $project['validaciones'] = [];

            $api = new Api('/proyectos', 'POST', $project);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha creado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
            $api->close();
        }

        private function editProject($project){
            // Se edita el proyecto
            $project['mediaItems'] = [];
            $idProject = $project['_id'];
            unset($project['_id']);

            $api = new Api('/proyectos/'. $idProject.'/'.$_SESSION['USER']['email'], 'PUT', $project);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha editado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getApiStatus());
            }
            $api->close();
        }

        private function editUser($user){
            // falta implementacion
        }

        // se agrega monto a la billetera del usuario
        private function addUserAmount($user){
            // agregar nuevo monto

            // suma
            $user['dineroInicial'] = $_SESSION['USER']['dineroInicial'] + intval($user['amount']);
            
            $api = new Api('/usuarios/actualizarDinero/'.$_SESSION['USER']['email'], 'PUT', $user);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $_SESSION['USER']['dineroInicial'] = $user['dineroInicial'];
                $this->ajaxRequestResult(true, "Se ha agregado correctamente", $user['dineroInicial']);
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
            $api->close();
        }

        // se realiza una donacion
        private function donateProject($donation){
            
            // se verifica el monto
            if(intval($donation['monto']) > $_SESSION['USER']['dineroInicial']){
                $this->ajaxRequestResult(false, "No tiene fondos suficientes para la donacion");
            }else{
                // se actualiza el dinero del donante
                $user['dineroInicial'] = $_SESSION['USER']['dineroInicial'] - intval($donation['monto']);
                    
                $api = new Api('/usuarios/actualizarDinero/'.$_SESSION['USER']['email'], 'PUT', $user);
                $api->callApi();

                // retornar el resultado
                if($api->getStatus() === 200){
                    $_SESSION['USER']['dineroInicial'] = $user['dineroInicial']; // se actualiza la sesion

                    // SE REALIZA LA DONACION
                    // agregar datos del donante
                    $donation['correoDonante'] = $_SESSION['USER']['email'];
                    $donation['nombreDonante'] = $_SESSION['USER']['name'];
                    $donation['telefonoDonante'] = $_SESSION['USER']['telefono'];

                    $api = new Api('/donaciones/'.$_SESSION['USER']['email'], 'POST', $donation);
                    $api->callApi();

                    // retornar el resultado
                    if($api->getStatus() === 200){
                        // se actualiza el monto del proyecto
                        // Se obtiene el monto actual

                        $api = new Api('/proyectosID/' . $donation['proyectoId'], 'GET');

                        $api->callApi();

                        $project = $api->getResult();

                        $nuevoMonto['montoReca'] = intval($project['montoReca']) + intval($donation['monto']);
                        
                        $api = new Api('/proyectos/actualizarMonto/'.$donation['proyectoId'], 'PUT', $nuevoMonto);
                        $api->callApi();

                        if(!$api->getStatus() === 200){
                            $this->ajaxRequestResult(false, "Ha ocurrido un error al actualiza el monto del proyecto", $api->getError());
                        }else{
                            $this->ajaxRequestResult(true, $api->getApiStatus(), array('wallet' => $user['dineroInicial'], 'newProjectAmount'=> $nuevoMonto['montoReca']));
                        }
                        
                    }else{
                        $this->ajaxRequestResult(false, "Ha ocurrido un error al realizar la donacion", $api->getError());
                    }

                }else{
                    $this->ajaxRequestResult(false, "Ha ocurrido un error al actualizar el monto de su billetera", $api->getError());
                }

                $api->close();
            }
            
        }

        // solicitar una mentoria
        private function requestMentoring($mentorship){

            $mentorship['correoUsuario'] = $_SESSION['USER']['email'];
            $mentorship['precio'] = 100;
            $mentorship['pagoRealizado'] = true;
            $mentorship['estado'] = 'Pendiente';

            // verificar si el mentor existe
            $api = new Api('/usuarios/correo/'.$mentorship['correoMentor'], 'GET');
            $api->callApi();

            $mentor = $api->getResult();

            if($api->getStatus() !== 200 || $mentor['rol'] !== 'mentor'){
                $this->ajaxRequestResult(false, "Mentor no es valido");
                return;
            }

            // realizar el rebajo si se puede
            // se verifica el monto
            if(intval($mentorship['precio']) > $_SESSION['USER']['dineroInicial']){
                $this->ajaxRequestResult(false, "No tiene fondos suficientes para la mentoria");
                return;
            }
            
            // se rebajan
            // se actualiza el dinero del donante
            $user['dineroInicial'] = $_SESSION['USER']['dineroInicial'] - intval($mentorship['monto']);
            
            $api = new Api('/usuarios/actualizarDinero/'.$_SESSION['USER']['email'], 'PUT', $user);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $_SESSION['USER']['dineroInicial'] = $user['dineroInicial']; // se actualiza la sesion

                // se crea la mentoria
                $api = new Api('/mentorias', 'POST', $memtorship);
                $api->callApi();
                
                if($api->getStatus() === 200){
                    // se crea la mentoria
                    $this->ajaxRequestResult(false, "Se ha creado la mentoria correctamente");

                }else{
                    $this->ajaxRequestResult(false, "Error al crear la mentoria");
                }

            }else{
                $this->ajaxRequestResult(false, "Error al realizar el pago");
            }

            
        }

        private function getUsers($post){
            $api = new Api('/usuarios/', 'GET');
            $api->callApi();
            
            // iniciar sesion

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha registrado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function loadProyects($post){
            $api = new Api('/proyectos/', 'GET');
            $api->callApi();

            $proyects = $api->getResult();

            // var_dump($proyects);
            foreach($proyects as $index => $proyect):
            ?>
                <div class="project" data-modal="donate-project" data-modal-data='{"id": "<?php echo $proyect['_id'];?>"}'>
                    <div class="img">
                        <img src="<?php echo URL_PATH; ?>public/img/project.jpg" alt="">
                    </div>
                    <div class="information">
                        <p class="title"><?php echo $proyect['pName']; ?></p>
                        <span class="categorie"><?php echo $proyect['categoriaP']; ?></span>
                        <p class="donated"><i class="fa-solid fa-dollar-sign"></i> <?php echo $proyect['montoReca']; ?></p>
                    </div>
                </div><!-- .project -->
            <?php
            endforeach;
        }

        private function loadUserDontations($post){
            $api = new Api('/donaciones/'.$_SESSION['USER']['email'], 'GET');
            $api->callApi();

            $donations = $api->getResult();

            if(count($donations) > 0){
                foreach ($donations as $key => $donation) {
                    ?>
                        <div class="donation">
                            <div class="donation-header flex flex-space">
                                <p><?php echo $donation['nombreProyecto'] ;?></p>
                                <p><?php echo date('d/m/Y', strtotime($donation['fechaDonacion'])); ?></p>
                            </div>
                            <p class="donation-amount"><i class="fa-solid fa-dollar-sign"></i> <?php echo $donation['monto']; ?></p>
                        </div>
                    <?php
                }
            }else{
                ?>

                    <div class="donation txt-center">
                        <p>No hay donaciones</p>
                    </div>

                <?php
            }
        }

        private function loadUserProyects($post){
            $api = new Api('/proyectos/'.$_SESSION['USER']['email'], 'GET');
            $api->callApi();

            $userProyects = $api->getResult();

            if(count($userProyects) > 0){
                foreach ($userProyects as $key => $proyect) { ?>
                    <div class="project" data-modal="edit-project" data-modal-data='{"id": "<?php echo $proyect['_id'];?>"}'>
                        <div class="img">
                            <img src="<?php echo URL_PATH; ?>public/img/project.jpg" alt="">
                        </div>
                        <div class="information">
                            <p class="title"><?php echo $proyect['pName']; ?></p>
                            <span class="categorie"><?php echo $proyect['categoriaP']; ?></span>
                            <p class="donated"><i class="fa-solid fa-dollar-sign"></i><?php echo $proyect['montoReca']; ?></p>
                        </div>
                    </div><!-- .project -->


                <?php }
            }
        }

        // cargar mentorias de mentor en perfil
        private function loadMentorshipsMentor(){
            // falta por implementar
            $api = new Api('/mentorias/'.$_SESSION['USER']['email'], 'GET');
            $api->callApi();

            $mentorships = $api->getResult();

            var_dump($mentorships);

            if($api->getStatus() !== 200 || is_null($mentorships)){ ?>
                <div class="mentorship">
                    <p class="txt-center">Error al cargar las mentorias</p>
                </div>

            <?php }else if(count($mentorships) > 0){

                foreach ($mentorships as $key => $mentorship) { ?>
                   <div class="mentorship">
                        <div class="mentorship-header flex flex-space">
                            <p><?php echo $mentorship['correoUsuario']; ?></p>
                            <p><?php echo $mentorship['fecha']; ?></p>
                        </div>
                        <p class="txt-center"><?php echo $mentorship['descripcion']?></p>
                    </div>
                <?php }

            }else{ ?>
                <div class="mentorship">
                    <p class="txt-center">No hay mentorias</p>
                </div>
            <?php }

            {


                
            }
        }
        
    }


    $initClass = new Ajax;

?>