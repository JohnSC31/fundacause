
<div class="new-project-container flex-col align-center">
    <h1 class="page-title-center">Crear proyecto</h1>

    <div class="new-project-form-container">
        <form action="" method="post" id="new-project-form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="name">Nombre</label>
                        <input type="text" name="name" id="name" maxlength="35">
                    </div>
                    <div class="field">
                        <label for="funding">Objetivo recaudación</label>
                        <input type="text" name="funding" id="funding">
                    </div>
                    <div class="field">
                        <label for="deadline">Fecha Límite</label>
                        <input type="date" name="deadline" id="deadline">                    
                    </div>
                </div><!-- col -->
                <div class="col">
                    <div class="field">
                        <label for="categories">Categoría</label>
                        <select name="categories" id="select-categorie">
                            <option value="Deporte">Deporte</option>
                            <option value="Technologia">Technologia</option>
                            <option value="Salud">Salud</option>
                            <option value="Educacion">Educacion</option>
                            <option value="Cultura">Cultura</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="pass">Descripción</label>
                        <textarea name="description" id="description" cols="30" rows="5" require maxlength="150"></textarea>

                    </div>
                </div><!-- col -->
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Crear">
                <input type="hidden" id="action" value="create">
            </div>
        </form>


    </div>
</div>
