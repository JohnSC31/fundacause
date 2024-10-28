
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
                        <label for="email">Categoría</label>
                        <select name="countries" id="select-categorie">
                            <option value="1">Categoría 1</option>
                            <option value="2">Categoría 2</option>
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
            </div>
        </form>


    </div>
</div>
