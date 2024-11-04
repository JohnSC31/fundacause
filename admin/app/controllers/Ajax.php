<?php 
    // CONTROLLADOR PARA LAS PETICIONES AJAX Y CONECIONES CON LA BASE DE DATOS
    if (!$_SERVER['REQUEST_METHOD'] === 'POST') { // se verifica que sea una peticion autentica
	    die('Invalid Request');
    }

    require_once '../../../app/config.php';
    require_once '../../../app/lib/Api.php';
    


    class Ajax {
        private $controller = "Ajax";
        private $ajaxMethod;
        private $data;
        private $db;

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
            require_once '../views/modals/'. $data['modal'] . '.php';
        }
        
        // --------------------------- SESSION DEL ADMINISTRADOR -------------------------------------------
        private function adminLogin($admin){

            // verificar credenciales 
            $api = new Api('/autenticacion/', 'POST', $admin);
            $api->callApi();
            // establecer la sesion
            if($api->getStatus() === 200){
                
                $adminSession = $api->getResult()['mensaje'];

                if($adminSession['rol'] !== 'admin'){
                    $this->ajaxRequestResult(false, "No eres administrador");
                    return;
                }

                $adminSession['SESSION'] = true;
                if(isset($adminSession['contrasenna'])) unset($adminSession['contrasenna']);

                $_SESSION['ADMIN'] = $adminSession;
    
                if(isset($_SESSION['ADMIN'])){
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

        private function adminLogout($admin){
            unset($_SESSION['ADMIN']); 

            if(!isset($_SESSION['ADMIN'])){
              
                $this->ajaxRequestResult(true, "Se ha cerrado sesion");
            }else{ 
                $this->ajaxRequestResult(false, "Error al cerrar sesion");
            }
        }

        private function loadUsers($post){
            // verificar credenciales 
            $api = new Api('/usuarios/', 'GET');
            $api->callApi();
            // establecer la sesion
            if($api->getStatus() === 200){

                $users = $api->getResult();
                $rols = json_decode($post['rols']);
                foreach ($users as $key => $user) {
                    if(isset($user['rol']) && in_array($user['rol'], $rols)){ ?>

                        <div class="user-horizontal-item">
                            <div class="profile flex">
                                <h2 class="<?php echo $user['estado'] == 'Inactivo' ? 'desactivated' : 'activated';?>">
                                    <?php echo $user['rol'] === 'mentor' ? '<i class="fa-solid fa-user-tie"></i>' : '<i class="fa-solid fa-circle-user"></i>';?>
                                </h2>
                                <div>
                                    <p class="name"><?php echo $user['name']; ?></p>
                                    <p class="email"><?php echo $user['email']; ?></p>
                                </div>
                            </div>
                            <div class="information">
                                <p><i class="fa-solid fa-phone"></i> <?php echo $user['telefono']; ?></p>
                                <p><i class="fa-solid fa-suitcase"></i> <?php echo $user['areaTrabajo']; ?></p>
                            </div>
                            <div class="action-container flex align-center">
                                <?php if(in_array('usuario', $rols) || in_array('mentor', $rols)): ?>
                                    <?php if($user['rol'] === 'usuario'): ?>
                                        <button class="btn btn-lightgreen" user-action="mentor" user-data="<?php echo $user['email']; ?>"><i class="fa-solid fa-user-tie"></i> Hacer mentor</button>
                                    <?php endif; ?>
                                    <button class="btn btn-green" user-action="<?php echo $user['estado'] == 'Activo' ? 'desactivate' : 'activate';?>" user-data="<?php echo $user['email']; ?>" ><i class="fa-solid fa-power-off"></i> <?php echo $user['estado'] == 'Activo' ? 'Desactivar' : 'Activar';?></button>
                                    <button class="btn btn-black" user-action="delete" user-data="<?php echo $user['_id']; ?>"><i class="fa-solid fa-trash-can"></i> Eliminar</button>
                                <?php else: ?>

                                <?php endif; ?>
                            </div>
                        </div>

                    <?php }
                }

            }
        }

        // crear un administrador
        private function createAdmin($admin){
            // Registro en la base de datos
            $api = new Api('/usuarios/', 'POST', $admin);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha registrado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        // ACCIONES PARA EL USUARIO
        private function desactivateUser($user){

            $api = new Api('/usuarios/des/'.$user['correo'], 'PUT');
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha desactivado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        } 

        private function activateUser($user){

            $api = new Api('/usuarios/act/'.$user['correo'], 'PUT');
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha activado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        } 

        private function deleteUser($user){

            $api = new Api('/usuarios/'.$user['id'], 'DELETE');
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha eliminado correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function makeUserMentor($user){

            $newRol = array('nuevoRol' => 'mentor');

            $api = new Api('/usuarios/cambiarRol/'.$user['email'], 'PUT', $newRol);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha hecho mentor correctamente");
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function createEvent($event){

            $event['correoHost'] = $_SESSION['ADMIN']['email'];
            $event['participantes'] = [];
            // Registro en la base de datos
            $api = new Api('/eventos/', 'POST', $event);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha creado el evento correctamente", $api->getApiStatus());
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function loadEvents(){

            // verificar credenciales 
            $api = new Api('/eventos/', 'GET');
            $api->callApi();
            // establecer la sesion
            if(!$api->getStatus() === 200){
            return;
            }

            $events = $api->getResult();
            foreach ($events as $key => $event) { ?>
                <div class="event">
                    <div class="header">
                        <h2 class="txt-center"><i class="fa-solid fa-champagne-glasses"></i></h2>
                        <p class="txt-center"><?php echo $event['correoHost']; ?></p>
                    </div>
                    <div class="event-info">
                        <p class="event-name txt-center"><?php echo $event['descripcion']; ?></p>
                        <div class="about-banner flex flex-space">
                            <p class="modality"><?php echo $event['modalidad']; ?></p>
                            <p class="date"><?php echo date('d/m/Y', strtotime($event['fechaHora'])); ?> </p>
                        </div>
                        
                        <p class="materials"><?php echo $event['materiales']; ?></p>

                    </div>
                </div>
            <?php }
        }

        private function deleteEvent($event){


            // Registro en la base de datos
            $api = new Api('/eventos/', 'DELETE', $event);
            $api->callApi();

            // retornar el resultado
            if($api->getStatus() === 200){
                $this->ajaxRequestResult(true, "Se ha creado el evento correctamente", $api->getApiStatus());
            }else{
                $this->ajaxRequestResult(false, "Ha ocurrido un error", $api->getError());
            }
        }

        private function loadDonations($post){

            $api = new Api('/donaciones', 'GET');
            $api->callApi();
            // establecer la sesion
            if($api->getStatus() === 200){

                $donations = $api->getResult();

                foreach ($donations as $key => $donation) { ?>

                    <div class="donation">
                        <div class="donation-header flex flex-space">
                            <p><?php echo $donation['nombreProyecto']. ' - '. $donation['nombreDonante']; ?></p>
                            <p><?php echo date('d/m/Y', strtotime($donation['fechaDonacion'])); ?></p>
                        </div>
                        <p class="donation-amount"><i class="fa-solid fa-dollar-sign"></i> <?php echo $donation['monto']; ?></p>
                    </div>

                <?php }
            }
        }

        private function loadStats($post){
            
            $stats = array('users' => 0, 'projects' => 0, 'donations'=> 0);

            $api = new Api('/usuarios', 'GET');
            $api->callApi();
            // establecer la sesion
            if(!$api->getStatus() === 200){
                $this->ajaxRequestResult(false, "Error al cargar las estadisticas", $stats);
                return;
            }
            $stats['users'] = count($api->getResult());

            $api = new Api('/proyectos', 'GET');
            $api->callApi();
            // establecer la sesion
            if(!$api->getStatus() === 200){
                $this->ajaxRequestResult(false, "Error al cargar las estadisticas", $stats);
                return;
                
            }
            $stats['projects'] = count($api->getResult());

            $api = new Api('/donaciones', 'GET');
            $api->callApi();
            // establecer la sesion
            if(!$api->getStatus() === 200){
                $this->ajaxRequestResult(false, "Error al cargar las estadisticas", $stats);
                return;
            }
            $stats['donations'] = count($api->getResult());

            $this->ajaxRequestResult(true, "Se cargan las estadisticas", $stats);

        }

        private function loadAdminProyects($post){

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

        private function loadSelectOptions($select){

            // se cargan de un select
            if($select['idSelect'] ===  "catProduct"){
                // carga categorias de home
                $this->db->query("query");
                $categories = $this->db->results(); // se obtienen de la base de datos

                if(count($categories) > 0){ ?>
                    <option value="" selected >Categorias</option>
                    <?php foreach($categories as $categorie) { ?>
                        <option value="<?php echo $categorie->idTipoProducto ?>"> <?php echo $categorie->tipoProducto; ?> </option>
                    <?php }
                }else{ ?>
                    <option value="">No hay Categorias</option>
                <?php }
            }

        }

        // --------------------------- SECCION DE VENTAS -------------------------------------------
        // metodo para cargar las data table de ventas
        private function loadDataTableSells($REQUEST){
            // se realiza la consulta a la base de datos
            $this->db->query("my query");
            // NULLOS PORQUE TRAEN TODOS LOS RESULTADOS

            $sells = $this->db->results(); // se obtienen de la base de datos
            $totalRecords = count($sells);

            // var_dump($employees);

            $dataTableArray = array();

            foreach($sells as $key => $row){
                $row = get_object_vars($row);
                $btnDetail = "<button type='button' class='btn btn-warning btn-sm' data-modal='order' data-modal-data='{\"idOrder\": ".$row['ordenID']."}'><i class='fa-solid fa-eye'></i></button>";

                $sub_array = array();
                $sub_array['idSell'] = $row['ordenID'];
                $sub_array['clientName'] = $row['nombreCliente'];
                $sub_array['status'] = $row['estado'];
                $sub_array['date'] = date('j-n-Y', strtotime($row['fecha']));
                $sub_array['actions'] = $btnDetail;
                $dataTableArray[] = $sub_array;
            }

            echo $this->dataTableOutput(intval($REQUEST['draw']), $totalRecords, $totalRecords, $dataTableArray);

        }

        //Params: Draw, TotalFiltrados, TotalRecords, Datos
        //Result: un array codificado en formato json
        //Prepara los datos de la consulta hecha y los ordena para ser leidos por las dataTables
        public function dataTableOutput($draw, $totalFiltered, $totalRecords, $data){
            // $output = array();
            $output = array(
                "draw"				=>	$draw,
                "recordsTotal"      =>  $totalFiltered,  // total number of records
                "recordsFiltered"   =>  $totalRecords, // total number of records after searching, if there is no searching then totalFiltered = totalData
                "data"				=>  $data
            );
        
            return json_encode($output);
        }

        // METODO PARA VALIDAR LOS MENSAJES DE ERRORES DE LOS SP (TRUE SI HAY ERROR, FALSE SI NO)
        private function isErrorInResult($result){
            return (isset($result['Error']) && $result['Error'] != "");
        }


    }


    $initClass = new Ajax;

?>