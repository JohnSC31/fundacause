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
            if(!$api->getStatus()){
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
            $this->ajaxRequestResult(true, "Se ha creado el proyecto correctamente", $project);
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

    }


    $initClass = new Ajax;

?>