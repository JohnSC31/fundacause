

<div class="hero flex align-center">
    <div class="container hero-content flex-col align-center">
        <h1>QUE EL ÚNICO LÍMITE DE TU PROYECTO SEA TU IMAGINACIÓN</h1>
        <button class="btn btn-green">
            <i class="fa-solid fa-lightbulb"></i> Publicar proyecto
        </button>
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
            <select name="" id="">
                <option value="">Categoría</option>
            </select>

            <input type="date">
        </div>

        <div class="project-list-container">
            <?php for($i = 1; $i <= 8; $i++): ?>
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
</section>