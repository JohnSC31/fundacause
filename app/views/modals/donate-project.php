
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
            <p class="donated"><i class="fa-solid fa-dollar-sign"></i> <span id="projectAmount"><?php echo $proyect['montoReca']; ?></span>/<?php echo $proyect['objetivoF']; ?></p>
        </div>

        <?php if(isset($_SESSION['USER'])) { ?>

        <div class="user-wallet">
            <h4>Donar al proyecto</h4>
            <h3 class="balance txt-center"><i class="fa-solid fa-dollar-sign"></i> <span id="userAmount"><?php echo $_SESSION['USER']['dineroInicial'];?></span> </h3>
            <div class="flex-col align-center">
                <input type="text" name="amount" id="donation-amount" placeholder="Cantidad">
                <input type="text" name="comentario" id="donation-comment" placeholder="Comentario">
                <input type="hidden" id="idProject" value="<?php echo $data['data']['id']; ?>">
                <input type="hidden" id="nameProject" value="<?php echo $proyect['pName']; ?>">
                <button class="btn btn-green" id="user-donate"><i class="fa-solid fa-plus"></i>Donar</button>
            </div>

        </div>

        <?php } ?>
      
    </div><!-- .modal-content -->
</div>