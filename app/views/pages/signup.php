
<div class="signup-container flex-col align-center">
    <h1 class="page-title-center">Registro</h1>

    <div class="signup-form-container">
        <form action="" method="post" id="signup_form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="name">Nombre</label>
                        <input type="text" name="name" id="name">
                    </div>
                    <div class="field">
                        <label for="idNumber">Cédula</label>
                        <input type="text" name="idNumber" id="idNumber">
                    </div>
                    <div class="field">
                        <label for="workArea">Área de trabajo</label>
                        <input type="text" name="workArea" id="workArea">
                    </div>
                    <div class="field">
                        <label for="phoneNumber">Teléfono</label>
                        <input type="text" name="phoneNumber" id="phoneNumber">
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
                            <input type="password" name="pass" id="pass">
                            <button id="showPassBtn" data-action="show" data-input="pass"><i class="fas fa-eye"></i></button>
                        </div>
                        
                    </div>
                    <div class="field">
                        <label for="pass">Confirmar Contraseña</label>
                        <input type="password" name="pass" id="pass">
                    </div>

                    <div class="field checkbox">
                        <label class="checkbox"><input type="checkbox" name="keep_sesion" id="conditions_terms" require checked>Acepto los términos y condiciones</label>
                    </div>
                </div><!-- col -->
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Registrarme">
                <a href="<?php echo URL_PATH; ?>login" class="btn btn-black">Iniciar Sesión</a>
            </div>

            <p class="forgot-pass">He olvidado mi contraseña</p>

        </form>


    </div>
</div>
