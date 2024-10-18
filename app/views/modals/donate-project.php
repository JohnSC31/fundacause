
<?php  

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
            <h3 class="title">Titulo del projecto</h3>
            <div class="info-banner flex flex-space">
                <p>Categoria</p>
                <p>12/12/24</p>
            </div>
            
            

            <p class="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil quam eos laborum minus qui officiis, inventore unde dicta nisi distinctio, repellat facilis vitae illo cumque esse necessitatibus quidem, neque sequi!</p>
            <p class="donated"><i class="fa-solid fa-dollar-sign"></i> 0 </p>
        </div>

        <div class="user-wallet">
            <h4>Mi billetera</h4>
            <h3 class="balance txt-center"><i class="fa-solid fa-dollar-sign"></i> 1000 </h3>
            <div class="flex-col align-center">
                <input type="text" name="amount" id="amount">
                <button class="btn btn-green"><i class="fa-solid fa-plus"></i> Donar</button>
            </div>

        </div>
      
    </div><!-- .modal-content -->
</div>