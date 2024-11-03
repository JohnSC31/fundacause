
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
        <h3 class="txt-center">Editar proyecto</h3>
        <form action="" method="post" id="edit-project-form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="name">Nombre</label>
                        <input type="text" name="name" id="name" maxlength="35" value="<?php echo $proyect['pName']?>">
                    </div>
                    <div class="field">
                        <label for="funding">Objetivo recaudación</label>
                        <input type="text" name="funding" id="funding" value="<?php echo $proyect['objetivoF']?>">
                    </div>
                    <div class="field">
                        <label for="deadline">Fecha Límite</label>
                        <input type="date" name="deadline" id="deadline" value="<?php echo $proyect['fechaLimite']?>">                    
                    </div>
                </div><!-- col -->
                <div class="col">
                    <div class="field">
                        <label for="categories">Categoría</label>
                        <select name="categories" id="select-categorie">
                            <option value="Deporte" <?php echo $proyect['categoriaP'] == 'Deporte' ? 'selected' : ''; ?>>Deporte</option>
                            <option value="Technologia" <?php echo $proyect['categoriaP'] == 'Technologia' ? 'selected' : ''; ?> >Technologia</option>
                            <option value="Salud" <?php echo $proyect['categoriaP'] == 'Salud' ? 'selected' : ''; ?>>Salud</option>
                            <option value="Educacion" <?php echo $proyect['categoriaP'] == 'Educacion' ? 'selected' : ''; ?>>Educacion</option>
                            <option value="Cultura" <?php echo $proyect['categoriaP'] == 'Cultura' ? 'selected' : ''; ?>>Cultura</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="pass">Descripción</label>
                        <textarea name="description" id="description" cols="30" rows="5" require maxlength="150"><?php echo $proyect['descripcion']; ?>
                        </textarea>

                    </div>
                </div><!-- col -->
                
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Editar">
                <input type="hidden" id="action" value="edit">
                <input type="hidden" id="idProject" value="<?php echo $data['data']['id']; ?>">
                
            </div>
        </form>

            <!-- mentoria= {
                correoMentor:    	(str, required),
                descripcion:	(str, required),
                precio: 	(str, required), fijo
                correoUsuario:(str, required),
                proyectoId: 	(str, required),
                fecha:	(Date, required),
                pagoRealizado:	(boolean, required)
            } -->
        <h3 class="txt-center">Solicitar mentoria $100</h3>
        <form action="" method="post" id="mentory-form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="mentor">Email mentor</label>
                        <input type="email" name="mentor" id="mentor-email" maxlength="35">
                    </div>
                    <div class="field">
                        <label for="mentorship-date">Fecha</label>
                        <input type="date" name="mentorship-date" id="date">
                    </div>
                </div><!-- col -->
                <div class="col">
                    <div class="field">
                        <label for="pass">Descripción</label>
                        <textarea name="description" id="description" cols="30" rows="5" require maxlength="150"></textarea>
                    </div>
                </div><!-- col -->
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Solicitar">
            </div>
        </form>
      
    </div><!-- .modal-content -->
</div>