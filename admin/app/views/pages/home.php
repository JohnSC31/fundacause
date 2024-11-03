
<div class="admin_container">
    <div class="header_container">
        <nav class="admin_navigation">
            <div class="admin_logo">
                <img src="<?php echo URL_PATH; ?>public/img/blackLogo.png" alt="Logo">
            </div>

            <ul id="admin_nav">
                <li data-admin-nav="stats" class=""><i class="fa-solid fa-chart-simple"></i> <span class="hide_medium"> Estadísticas</span></li>
                <li data-admin-nav="users" class=""><i class="fa-solid fa-users"></i> <span class="hide_medium"> Usuarios</span></li>
                <li data-admin-nav="projects" class=""><i class="fa-solid fa-lightbulb"></i> <span class="hide_medium"> Proyectos</span></li>
                <li data-admin-nav="donations" class=""><i class="fa-solid fa-hand-holding-dollar"></i> <span class="hide_medium"> Donaciones</span></li>
                <li data-admin-nav="admins" class=""><i class="fa-solid fa-user-shield"></i> <span class="hide_medium"> Administradores</span></li>
                <li data-admin-nav="events" class=""><i class="fa-solid fa-calendar-days"></i> <span class="hide_medium"> Eventos</span></li>
            </ul>

            <div class="logout_btn_container">
                <button class="btn btn-black" data-admin-logout="true">Cerrar Sesión</button>
            </div>

        </nav>
        <p class="header_rights hide_medium">Todos los derechos resevados 2023</p>
    </div>
    <div class="dashboard_container" id="dashboard_container">
        

        <!-- SECCION DE ESTADISTICAS -->
        <?php require_once '../app/views/inc/admin-stats.php'; ?>

        <!-- SECCION DE USUARIOS -->
        <?php require_once '../app/views/inc/admin-users.php'; ?>

        <!-- SECCION DE PROYECTOS -->
        <?php require_once '../app/views/inc/admin-projects.php'; ?>

        <!-- SECCION DE DONATIONS -->
        <?php require_once '../app/views/inc/admin-donations.php'; ?>

        <!-- SECCION DE ADMINS -->
        <?php require_once '../app/views/inc/admin-admins.php'; ?>

        <!-- SECCION DE NOTIFICATIONS -->
        <?php require_once '../app/views/inc/admin-events.php'; ?>
        
    </div>
</div>

