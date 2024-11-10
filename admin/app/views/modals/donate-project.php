
<?php  
   $api = new Api('/proyectosID/' . $data['data']['id'], 'GET');

   $api->callApi();

   $proyect = $api->getResult();

   
?>

<div class="myModal modal-donate-project" >

    <div class="modal_header">
        <a close-modal="" class="close_modal"><i class="fas fa-times"></i></a>
    </div>

    <div class="modal-content">
        <div class="img">
            <img src="<?php echo URL_PATH; ?>public/img/project.jpg" alt="">
        </div>
        <div class="information">
            <h3 class="title"><?php echo $proyect['pName']; ?></h3>
            <div class="info-banner flex flex-space">
                <p><?php echo $proyect['categoriaP']; ?></p>
                <p><?php echo $proyect['fechaLimite']; ?></p>
            </div>
            
            

            <p class="description"><?php echo $proyect['descripcion']; ?></p>
            <p class="donated"><i class="fa-solid fa-dollar-sign"></i> <span id="projectAmount"><?php echo $proyect['montoReca'] .'/'.$proyect['objetivoF']; ?></span></p>
        </div>
      
    </div><!-- .modal-content -->
</div>