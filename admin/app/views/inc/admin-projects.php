<div class="projects_container" style="display:none;">
    <h1>Proyectos</h1>

    <div class="project-list-container">
        <?php for($i = 1; $i <= 6; $i++): ?>
            <div class="project">
                <div class="img">
                    <img src="<?php echo URL_PATH; ?>public/img/project.jpg" alt="">
                </div>
                <div class="information">
                    <p class="title">Titulo del projecto</p>
                    <span class="categorie">Categoria</span>
                    <p class="donated"><i class="fa-solid fa-dollar-sign"></i> 0 </p>
                </div>
            </div><!-- .project -->

        <?php endfor; ?>
    </div>

</div>