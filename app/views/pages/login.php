
<div class="login-container flex-col align-center">
    <h1 class="page-title-center">Inciar sesión</h1>

    <div class="login-form-container">
        <form action="" method="post" id="login_form">
 
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
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Iniciar sesión">
                <a href="<?php echo URL_PATH; ?>signup" class="btn btn-black">Registrarme</a>
            </div>

            <p class="forgot-pass">He olvidado mi contraseña</p>

        </form>


    </div>
</div>
