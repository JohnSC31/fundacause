
<?php  

?>

<div class="myModal modal-donate-project" >

    <div class="modal_header">
        <a close-modal="" class="close_modal"><i class="fas fa-times"></i></a>
    </div>

    <div class="modal-content">
        <h2 class="txt-center">Editar usuario</h2>
        <form action="" method="post" id="edit-user-form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="name">Nombre</label>
                        <input type="text" name="name" id="name" maxlength="35" value="<?php echo $_SESSION['USER']['name']; ?>">
                    </div>
                    <div class="field">
                        <label for="workArea">Área de trabajo</label>
                        <input type="text" name="workArea" id="workArea"  maxlength="20" value="<?php echo $_SESSION['USER']['areaTrabajo']; ?>">
                    </div>
                </div><!-- col -->
                <div class="col">
                    <div class="field">
                        <label for="phoneNumber">Teléfono</label>
                        <input type="text" name="phoneNumber" id="phoneNumber" data-mask="0000-0000" value="<?php echo $_SESSION['USER']['telefono']; ?>">
                    </div>
                    <div class="field">
                        <label for="email">Correo electrónico</label>
                        <input type="email" name="email" id="email" value="<?php echo $_SESSION['USER']['email']; ?>">
                    </div>
                </div><!-- col -->
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Guardar">
            </div>
        </form>
      
    </div><!-- .modal-content -->
</div>