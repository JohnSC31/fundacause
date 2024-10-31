<div class="profile container">
    <h1 class="page-title">Perfil</h1> 
    <?php var_dump($_SESSION['USER']); ?> 

    <div class="profile-content">
        <div class="profile-sidebar">
            <div class="user">
                <p class="icon txt-center"><i class="fa-solid fa-circle-user"></i></p>

                <div class="user-info">
                    <p class="name"><?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['name']; ?></p>
                    <p class="email"><?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['email']; ?></p>
                </div>

                <p><i class="fa-solid fa-briefcase"></i> <?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['areaTrabajo']; ?></p>
                <p><i class="fa-solid fa-phone"></i> <?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['telefono']; ?></p>
                <div class="user-action flex align-center">
                    <button class="btn btn-black"><i class="fa-solid fa-user-pen"></i>Editar</button>
                </div>
            </div>

            <div class="donation-history">
                <h3 class="txt-center">Historial de donaciones</h3>

                <div class="history" id="user-donations-history">
                    <div class="donation">
                        <div class="donation-header flex flex-space">
                            <p>Nombre del proyecto</p>
                            <p>21/2/24</p>
                        </div>
                        <p class="donation-amount"><i class="fa-solid fa-dollar-sign"></i> 500</p>
                    </div>
                    <div class="donation">
                        <div class="donation-header flex flex-space">
                            <p>Nombre del proyecto</p>
                            <p>21/2/24</p>
                        </div>
                        <p class="donation-amount"><i class="fa-solid fa-dollar-sign"></i> 500</p>
                    </div>
                </div>
            </div>

        </div>
        <div class="profile-main">
            <div class="wallet">
                <h3>Billetera</h3>
                <h2 class="wallet-amount txt-center"><i class="fa-solid fa-dollar-sign"></i> 0</h2>
                <div class="load-wallet flex-col align-center">
                    <div class="load-wallet-container flex">
                        <input type="text" name="amount" id="amount">
                        <button class="btn btn-green"><i class="fa-solid fa-plus"></i></button>
                    </div>
                   
                </div>
            </div>
            <div class="my-project-container">
                <div class="my-projects-header flex flex-space">
                <h3>Mis proyectos</h3>
                <a class="btn btn-black"  href="<?php echo URL_PATH; ?>project"><i class="fa-solid fa-lightbulb"></i> Crear proyecto</a>
                </div>
                
                <div class="project-list-container">
                    <?php for($i = 1; $i <= 4; $i++): ?>
                        <div class="project" data-modal="edit-project">
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
        </div>
    </div>


</div>