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
            if(!$api->getError()){
                $this->ajaxRequestResult(true, "Se ha registrado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function userLogin($user){
            // verificar credenciales 

            // establecer la sesion
            $this->ajaxRequestResult(true, "Se ha iniciado sesion correctamente", $user);

        }

        private function createProject($project){
            $this->ajaxRequestResult(true, "Se ha creado el proyecto correctamente", $project);
        }

        private function getUsers($post){
            $api = new Api('/usuarios/', 'GET');
            $api->callApi();
            
            // iniciar sesion

            // retornar el resultado
            if(!$api->getError()){
                $this->ajaxRequestResult(true, "Se ha registrado correctamente", $api->getResult());
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

    }


    $initClass = new Ajax;

?>