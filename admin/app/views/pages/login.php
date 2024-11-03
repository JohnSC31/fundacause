<div class="admin-login-container flex-col align-center">
    <h1 class="page-title-center">Iniciar sesión</h1>

    <div class="admin-login-form-container">
        <form action="" method="post" id="admin-login-form">

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
                <input type="submit" class="btn btn-green" value='Iniciar sesión'>
            </div>
        </form>
    </div>
</div>
