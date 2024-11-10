

<div class="hero flex align-center">
    <div class="container hero-content flex-col align-center">
        <h1>QUE EL ÚNICO LÍMITE DE TU PROYECTO SEA TU IMAGINACIÓN</h1>
        <?php if(isset($_SESSION['USER'])): ?>
            <a href="<?php echo URL_PATH; ?>project" class="btn btn-green"><i class="fa-solid fa-lightbulb"></i> <span class="hide_medium"> Publicar proyecto </span></a>
        <?php else: ?>
            <a href="<?php echo URL_PATH; ?>signup" class="btn btn-lightgreen"><i class="fa-solid fa-user-plus"></i> <span class="hide_medium"> Registrarme </span></a>
        <?php endif; ?>
    </div>
</div>

<section class="search">
    <div class="search-content container flex align-center">
        <input type="text" id="search-project" placeholder="Buscar">
        <button class="btn btn-green"><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>
</section>


<section class="project-list">
    <div class="project-list-content container">
        <div class="filters flex">
            <select name="" id="search-categoria">
                <option value="">Categoría</option>
            </select>

            <input type="date" id="search-date">
        </div>

        <div class="project-list-container" id="proyects-home-container">
            <!-- <?php for($i = 1; $i <= 0; $i++): ?>
                <div class="project" data-modal="donate-project">
                    <div class="img">
                        <img src="<?php echo URL_PATH; ?>public/img/project.jpg" alt="">
                    </div>
                    <div class="information">
                        <p class="title">Titulo del projecto</p>
                        <span class="categorie">Categoria</span>
                        <p class="donated"><i class="fa-solid fa-dollar-sign"></i> 0 </p>
                    </div>
                </div><!-- .project -->

            <?php endfor; ?> -->
        </div>
    </div>
</section>