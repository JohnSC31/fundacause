<div class="profile container">
    <h1 class="page-title">Perfil</h1> 
    

    <div class="profile-content">
        <div class="profile-sidebar">
            <div class="user">
                <p class="icon txt-center"><i class="fa-solid <?php echo $_SESSION['USER']['rol'] === 'mentor' ?"fa-user-tie" : "fa-circle-user";?>"></i></p>

                <div class="user-info">
                    <p class="name"><?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['name']; ?></p>
                    <p class="email"><?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['email']; ?></p>
                </div>

                <p><i class="fa-solid fa-briefcase"></i> <?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['areaTrabajo']; ?></p>
                <p><i class="fa-solid fa-phone"></i> <?php if(isset($_SESSION['USER'])) echo $_SESSION['USER']['telefono']; ?></p>
            </div>

            <div class="donation-history">
                <h3 class="txt-center">Historial de donaciones</h3>

                <div class="history" id="user-donations-history">
                    
                </div>
            </div>

        </div>
        <div class="profile-main">
            <div class="wallet">
                <h3>Billetera</h3>
                <h2 class="wallet-amount txt-center"><i class="fa-solid fa-dollar-sign"></i> <span id="userAmount"><?php echo $_SESSION['USER']['dineroInicial'];  ?></span></h2>
                <div class="load-wallet flex-col align-center">
                    <div class="load-wallet-container flex">
                        <input type="text" name="amount" id="addAmount">
                        <button class="btn btn-green" id="add-amount"><i class="fa-solid fa-plus"></i></button>
                    </div>
                   
                </div>
            </div>

            <div class="mentorships">
                <?php if($_SESSION['USER']['rol'] !== 'mentor') : ?>
                   
                    <div class="request-mentory-form-container">
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
                                        <input type="datetime-local" name="mentorship-date" id="date">
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
                    </div>

                <?php endif; ?>

                <h3><?php echo $_SESSION['USER']['rol'] !== 'mentor' ? 'Mis mentorias': 'Mentorias pendientes' ; ?></h3>

                <div class="mentorships-container" id="mentorships-profile-container">
                    <div class="mentorship">
                        <div class="mentorship-header flex flex-space">
                            <p>jostsace05@gmail.com</p>
                            <p>12/6/2024</p>
                        </div>
                        <p class="txt-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, aliquid nulla. Nemo non error, dolores quasi ullam consequatur earum rem de.</p>
                        <div class="mentorship-footer flex">
                            <p class="status">Pendiente</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="my-project-container">
                <div class="my-projects-header flex flex-space">
                <h3>Mis proyectos</h3>
                <a class="btn btn-black"  href="<?php echo URL_PATH; ?>project"><i class="fa-solid fa-lightbulb"></i> Crear proyecto</a>
                </div>
                
                <div class="project-list-container" id="proyects-profile-container">
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