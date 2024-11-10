<div class="admins_container" style="display:none;">
    <h1>Administradores</h1>


    <!-- FORMULARIO -->
    <div class="admin-signup-form-container">
        <form action="" method="post" id="create-admin-form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="name">Nombre</label>
                        <input type="text" name="name" id="name" maxlength="35">
                    </div>
                    <div class="field">
                        <label for="idNumber">Cédula</label>
                        <input type="text" name="idNumber" id="idNumber"  data-mask="0 0000 0000">
                    </div>
                    <div class="field">
                        <label for="workArea">Área de trabajo</label>
                        <input type="text" name="workArea" id="workArea"  maxlength="20">
                    </div>
                    <div class="field">
                        <label for="phoneNumber">Teléfono</label>
                        <input type="text" name="phoneNumber" id="phoneNumber" data-mask="0000-0000">
                    </div>
                </div><!-- col -->
                <div class="col">
                    <div class="field">
                        <label for="email">Correo electrónico</label>
                        <input type="email" name="email" id="email">
                    </div>
                    <div class="field">
                        <label for="pass">Contraseña</label>
                        <div class="pass_input flex align">
                            <input type="password" name="pass" id="pass" maxlength="25">
                            <button id="showPassBtn" data-action="show" data-input="pass"><i class="fas fa-eye"></i></button>
                        </div>
                        
                    </div>
                    <div class="field">
                        <label for="pass">Confirmar Contraseña</label>
                        <input type="password" name="pass" id="confirm-pass" maxlength="25">
                    </div>
                </div><!-- col -->
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Crear administrador">
            </div>

        </form>
    </div>

    <!-- Lista de administradores/acciones -->
    <div class="users-list-container" id="admin-list-container">

        <!-- <div class="user-horizontal-item">
            <div class="profile flex">
                <h2><i class="fa-solid fa-circle-user"></i></h2>
                <div>
                    <p class="name">Nombre Completo</p>
                    <p class="email">jostsace05@gmail.com</p>
                </div>
            </div>
            <div class="information">
                <p><i class="fa-solid fa-phone"></i> 8515-8411</p>
                <p><i class="fa-solid fa-suitcase"></i> Area de trabajo</p>
            </div>
            <div class="action-container flex align-center">
                <button class="btn btn-green"><i class="fa-solid fa-power-off"></i> Desactivar</button>
                <button class="btn btn-black"><i class="fa-solid fa-trash-can"></i> Eliminar</button>
            </div>
        </div> -->


    </div>

</div>