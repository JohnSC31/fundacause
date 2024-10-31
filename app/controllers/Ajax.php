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
                <div class="project" data-modal="donate-project" data-modal-data='{"id": "<?php echo $proyect['_id'];?> "}'>
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
                                <p><?php echo $donation['fechaDonacion']; ?></p>
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
    }


    $initClass = new Ajax;

?>