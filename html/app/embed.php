<!doctype html>
<html>

<head>
    <?php
        $pageUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        $isLocalServer = (stripos($pageUrl,'://local.yummy') !== false);
    ?>
    <title>Yummy Embed</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- <link rel="stylesheet" href="./assets/css/milligram.css"> -->
    <link rel="stylesheet" href="./assets/css/style.css">
    <link href="./assets/css/fontawesome-all.css" rel="stylesheet"><!--font awesome-->

    <script src='./assets/js/lightdom.js'></script>
    <script src=<?=$isLocalServer?'./src/app.js':'./dist/app.js'?>></script>
</head>

<body>
    <!-- Wszystkie 'strony' (czy to będą strony, czy popupy to inna rzecz) - czyli osobno kompozytor pizzy, koszyk, zamówienie -->
    <div class = 'app-container'>

        <div class = 'loader'>
            <!-- <h2 class = 'loader-header'>Yummy</h2> -->
            <!-- <div class = 'loader-progress'></div> -->
            <!-- <img src = './assets/images/loader.png'> -->
            <video src = './assets/videos/loader2.webm' autoplay loop></video>
            
        </div>

        <!-- Pizza plus menu, domyślnie ukryte, będzie pokazane jak się wszystkie images załadują -->
        <div class = 'composer-container' style = 'display:none;'>

            <!-- Samo danie (plus cena i może inne, na nim)-->
            <!-- Potrzebujemy wrappera, bo ono będzie się skalowało samo (css) a scene będziemy scalować podług niego (transform)-->
            <div class="scene-wrapper" >

                <!-- To będziemy skalować (razem np. z ceną), ale już danie i składniki (też skalowane) są osobnym
                dzieckiem, bo być może będziemy tym obracać (w przeciwieństwie do ceny czy dymu)-->
                <div class = 'scene-scale'>
                    
                    <!-- Nalepka z ceną -->
                    <div class = 'dish-price'>
                        <img class = 'dish-price-img' src = './assets/images/dish-price.png'>
                        <div class = 'dish-price-content' style = 'margin:0 auto;'>
                            <div class = 'dish-price-price'>0,00</div>
                            <div class = 'dish-price-unit'>PLN</div>
                        </div>
                    </div>

                    <div class = 'smoke' style = 'display:none;position:absolute;width:100%;height:100%;z-index:1;opacity:0.7'>
                        <video src = './assets/videos/smoke-8-loop-rgba.webm' loop style = 'object-fit: cover;width:100%;height:100%;'></video>
                    </div>
                    <!-- Samo danie -->
                    <div class="scene">
                    </div>
                </div>
            </div>

            <!-- Menu 
                Potrzebujemy wrappera, bo oprócz dynamicznie budowanego (w .menu), może coś jeszcze dojdzie, np.
                teraz .devloper div
            -->
            <div class = 'menu-wrapper'>
                <div class = 'menu'></div>
                <div class = 'clear-fix'></div>
                <div class='developer'>
                    <h2>Developer</h2>
                    <div>
                        <label>Smoke <input type = 'checkbox' class = 'dev-smoke-active' autocomplete="off"></label>
                        <label>Dish rotation<input type = 'checkbox' class = 'dev-scene-rotation-active' autocomplete="off"></label>
                    </div>
                    <div class = 'dev-scene-info'>Dynamic Scene info</div>
                    <!-- <button class='btn-animate-run'>Go</button> -->
                </div>            
            </div>
            <!-- Przyciski zamawiam i może inne. W przeciw. do .menu-wrapper, to jest raczej fixed, żadnego scrollowania-->
            <div class = 'actions-wrapper'>
                <div class = 'actions'>
                    <button class = 'actions-ready'>Gotowe!</button>
                </div>
            </div>
            <div class = 'clear-fix'></div>
        </div>

        <!-- Koszyk -->
        <!-- <div class='basket-container'>
            Koszyk
        </div> -->

        <!-- Zamówienie -->
        <!-- <div class='order-container'>
            Zamówienie
        </div> -->
    </div>

  

    <script>
        "use strict";
        let app = null;
        l().ready(() => {
            fetch('./ingredients/index.json')
            .then(response => { return response.text(); })
            .then(result => {
                //console.log(result);//text
                //console.log(JSON.parse(result));//object
                let data = JSON.parse(result);
                // W ten sposób można nadpisać to co w innym przypadku weźmiemu z URLa
                data.devMode = true;

                
                app = new App({
                    container: '.app-container',
                    data: data,
                });                
            });            
            //console.log('document.URL:',document.URL);

            
        });

    </script>
</body>

</html>