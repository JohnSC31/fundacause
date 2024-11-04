<div class="events_container" style="display:none;">
    <h1>Eventos</h1>

    <div class="create-event-form-container">
        <p>Crear evento</p>
        <form action="" method="post" id="create-event-form">
            <div class="col_2">
                <div class="col">
                    <div class="field">
                        <label for="name">Nombre del evento</label>
                        <input type="text" name="name" id="event-name" maxlength="35">
                    </div>
                    <div class="field">
                        <label for="date">Fecha</label>
                        <input type="date" name="date" id="event-date">
                    </div>
                    <!-- <div class="field">
                        <label for="price">Precio entrada</label>
                        <input type="text" name="price" id="price"  maxlength="20">
                    </div> -->
                </div><!-- col -->
                <div class="col">
                    <div class="field">
                        <label for="modality">Modalidad</label>
                        <select name="modality" id="select-modality">
                            <option value="Presencial">Presencial</option>
                            <option value="Virtual">Virtual</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="pass">Materiales</label>
                        <textarea name="description" id="description" cols="30" rows="5" require maxlength="150"></textarea>

                    </div>
                </div><!-- col -->
            </div>
            
            <div class="submit">
                <input type="submit" class="btn btn-green" value="Crear evento">
            </div>

        </form>
    </div>

    <div class="events-list-container" id="events-list-container">

        <div class="event">
            <div class="header">
                <h2 class="txt-center"><i class="fa-solid fa-champagne-glasses"></i></h2>
                <p class="txt-center">jostsace05@gmail.com</p>
            </div>
            <div class="event-info">
                <p class="event-name txt-center">Nombre del evento</p>
                <div class="about-banner flex flex-space">
                    <p class="modality">Presencial</p>
                    <p class="date">12/23/3344</p>
                </div>
                
                <p class="materials">Materiales para el evento</p>

                <div class="actions flex">
                    <button class="btn btn-black" register-event="idevent">Registrarme</button>
                </div>
            </div>
        </div>
        
    </div>

</div>