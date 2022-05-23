"use strict";

/**
 * Użytki różne
 */
const Utils = {
    /*
    'Rozwinie' stringa (np. urle do images). Zawsze zwróci array, jeśli zapodany url
    jest prosty, np. 'blah/image.jpg' to to po prostu będzie 1-szy element w zwróconej tablicy
    ale jeśli będzie to np. 'tomato/{1-5}.png' to zwróci 5 elementów, np. tomato/1.png, tomato/2.png etc
    */
    expandString(input) {
        if (!input.includes('{')) {
            return [input];
        }
        let specialMatch = input.match(/\{(.*?)\}/)[0];// np. "{1-5}"
        // console.log(specialMatch);
        let range = specialMatch.match(/(\d+)\s*-\s*(\d+)/).slice(1, 3);
        // console.log('range:', range);
        let result = [];
        for (let index = parseInt(range[0]); index <= parseInt(range[1]); index++) {
            let newStr = input.replace(specialMatch, index);
            result.push(newStr);
        }
        return result;
    },

    random(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * diameter średnica,
     * uniform: jeśli true no to równo, jeśli false to bardziej prawdopodobne na środku
     * @returns {x:number, y:number}
     */
    randomInsideCircle(diameter, castToInt = true, uniform = true) {
        let r = diameter / 2;
        let a = Math.random(),
            b = Math.random();

        if (uniform) {
            if (b < a) {
                let c = b;
                b = a;
                a = c;
            }
        }

        //return [b * r * Math.cos( 2 * Math.PI * a / b ), b * r * Math.sin( 2 * Math.PI * a / b )];
        let coords = { x: b * r * Math.cos(2 * Math.PI * a / b), y: b * r * Math.sin(2 * Math.PI * a / b) };
        coords.x += r;
        coords.y += r;
        if (castToInt) {
            coords.x = parseInt(coords.x);
            coords.y = parseInt(coords.y);
        }
        return coords;
    }

}
// Tu są ułatwiacze, mają bardziej ogólny charakter niż tylko dla Yummy, stąd 'namespace' LightScene
class LightScene {

}
/**
 * Point. Only for some math purposes, not drawing anything.
 * Examples:
 * let p1 = new LightScene.Point(10,2);
 * let p2 = new LightScene.Point({x:2,y:3});
 */
LightScene.Point = class {
    //see this.set for possible x,y values
    constructor(x = 0, y = null) {
        this.set(x, y);
    }

    /*
    possible scenarios:
    point.set(42,12);
    point.set([42,12]);
    point.set([x:42,y:12]);
    point.set(anotherPointObject);
    point.set(42);//x and y set to '42'. Useful e.g. with the this.multiply method. 
    */
    set(x = null, y = null) {
        //12.3 or "12.3"
        if (typeof x === 'number' || typeof x === 'string') {
            this.x = parseFloat(x);
            if (y !== null) {
                this.y = parseFloat(y);
            } else {
                this.y = x;//so, based on one value.
            }
        } else if (Array.isArray(x)) {
            let point = x; //readability
            this.x = parseFloat(point[0]);
            this.y = parseFloat(point[1]);
        } else if (typeof x === 'object') {//we (Point) or any other object having x,y properties
            let point = x; //readability
            this.x = point.x;
            this.y = point.y;
        } else {//apparently user wants an empty object, or something.
            this.x = this.y = 0;
        }
        return this;
    }
    //see this.set for possible x,y values
    add(x, y) {
        let point = new this.constructor(x, y); //this will handle the 'x' being numbers, array, a simple object, or another Point 
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    //see this.set for possible x,y values
    substract(x, y) {
        let point = new this.constructor(x, y); //this will handle the 'x' being numbers, array, a simple object, or another Point 
        this.x -= point.x;
        this.y -= point.y;
        return this;
    };

    /**
     * see this.set for possible x,y values.
     * examples: point.multiply(2,2);point.multiply(2);
     */
    multiply(x, y) {
        let point = new this.constructor(x, y); //this will handle the 'x' being numbers, array, a simple object, or another Point 
        this.x *= point.x;
        this.y *= point.y;
        return this;
    }

    /*
    alias for this.multiply
    */
    scale(x, y) {
        return this.multiply(x, y);
    }


    /**
     * see this.set for possible x,y values.
     * examples: point.divide(2,2);point.divide(2);
     */
    divide(x, y) {
        let point = new this.constructor(x, y); //this will handle the 'x' being numbers, array, a simple object, or another Point 
        this.x /= point.x;
        this.y /= point.y;
        return this;
    }

    //see this.set for possible x,y values
    equals(x, y) {
        let point = new this.constructor(x, y); //this will handle the 'x' being numbers, array, a simple object, or another Point 
        return (this.x === point.x && this.y === point.y);
    }

    clone() {
        return new this.constructor(this);
    }

    toString() {
        return JSON.stringify(this);
    }
}

/**
 * Just coordinates (rectangle), we expect x1,y1,x2,y2 or x,y,width,height coordinates.
 */
LightScene.Rect = class {
    constructor(rect) {
        if (typeof rect.x1 !== 'undefined') {
            this.x1 = rect.x1;
            this.y1 = rect.y1;
            this.x2 = rect.x2;
            this.y2 = rect.y2;
        } else if (typeof rect.x !== 'undefined' && typeof rect.width !== 'undefined') {
            this.x1 = rect.x;
            this.y1 = rect.y;
            this.x2 = rect.x + rect.width;
            this.y2 = rect.y + rect.height;
        } else {
            this.x1 = this.y1 = this.x2 = this.y2 = null;
        }
    }

    width() {
        return this.x2 - this.x1;
    }

    height() {
        return this.y2 - this.y1;
    }

    center() {
        return new LightScene.Point(this.x1 + this.width() / 2, this.y1 + this.height() / 2);
    }
}

/**
 * To już konkretnie dla apki Yummy. Dla części odpowiadającej za rysowanie samej pizzy oraz menu. Ale bez koszyka czy zamówienia.
 * */
class Composer {
}

Composer.currentScript = document.currentScript;

/**
 * "Uklasowiony" ingredient. Tzn. info o składniku, albo całe ciasto pizzowe, albo info, że to mają być pomidory (zależy od 'type')
 */
Composer.Ingredient = class {

    /**
     * app: instancja głównej klasy, potrzebujemy tylko po to by mieć dostęp do .appUrl
     */
    constructor(app, ingredientBasic) {
        this.app = app;
        //console.log(ingredientBasic);
        Object.assign(this, JSON.parse(JSON.stringify(ingredientBasic)));
    }

    /*
     np. .hasMode('autoadd'): true/false
    */
    hasMode(str) {
        if (this.mode && this.mode.toLowerCase().includes(str)) {
            return true;
        }
        return false;
    }

    /**
     * Zwróci typ ('particles' (domyślny), lub 'entire' lub może coś jeszcze innego)
     */
    getType() {
        return (typeof this.type !== 'undefined') ? this.type : 'particles';
    }

    getAppUrl() {
        return this.app.url;
    }

    /**
     * Pełen url do obrazka.
     */
    getImageUrls() {
        let url = null;
        // Czy był zapodany?
        if (this.img) {
            url = this.img;
        } else {
            // Nie, sami se zbudujemy.
            url = `${this.name}/1.png`;
        }
        // To w razie, gdyby 'img' to był np. '/coś/{1-5}.png'
        let urls = Utils.expandString(url);
        // Teraz tylko zamienić na pełen url.
        urls.forEach((urlItem, index) => {
            urls[index] = this.getAppUrl() + '/ingredients/' + urlItem;
        })
        return urls;
    }

    // W przyszłości - jakaś miniaturka składnika, na teraz po prostu pierwsze zdjęcie.
    getThumbUrl() {
        return this.getImageUrls()[0];
    }

    // Jeśli określone to zwróci konkretne pozycje x,y dla poszczególnych particles.
    // mealSizeCategory: small, medium, large.
    getParticlesPositions(mealSizeCategory = 'default') {
        let positions = null;
        if (typeof this.positions !== 'undefined') {
            if (typeof this.positions[mealSizeCategory] !== 'undefined') {
                positions = this.positions[mealSizeCategory];
            }
        };
        return positions;
    }
}

Composer.Layer = class {

    constructor(scene = null, ingredient = {}) {
        // Instancja Scene
        this.scene = scene;

        // Składnik
        this.ingredient = ingredient;

        // Nasza reprezentacja w DOMie
        this.layerEl = null;
        // ingredient.getType to 'entire' albo 'particle.
        let zIndex = typeof ingredient.zIndex === 'undefined' ? 0 : ingredient.zIndex;
        this.scene.sceneEl.insertAdjacentHTML('beforeend', `
            <div class = "layer layer-${ingredient.getType()}"
                 style = "z-index:${zIndex};opacity:0"
            >
            </div>
        `);
        this.layerEl = this.scene.sceneEl.lastElementChild;

        this.build();
    }

    isDevMode() {
        return this.scene.isDevMode();
    }

    build() {
        // To potem brak skądś.
        let mealSizeCategory = 'small';

        // Dodanie particles (składników)
        if (this.ingredient.getType() === 'entire') {
            let imgUrl = this.ingredient.getImageUrls()[0];
            let html = `
                <div class = ''><img src='${imgUrl}'></div>
            `;
            this.layerEl.insertAdjacentHTML('beforeend', html);
        } else if (this.ingredient.getType() === 'particles') {
            let imgUrls = this.ingredient.getImageUrls();
            let particlesCount = 10;
            if (typeof this.ingredient.count !== 'undefined') {
                particlesCount = this.ingredient.count;
            } else {
                let particlePositions = this.ingredient.getParticlesPositions(mealSizeCategory);
                if (particlePositions) {
                    particlesCount = particlePositions.length;
                }
            }

            // Tu tylko dodajemy, nie interesują nas pozycje xy, tym zajmie się this.animate
            let html = '';
            for (let n = 0; n < particlesCount; n++) {
                let randomImgUrl = imgUrls[Utils.random(0, imgUrls.length - 1)];
                //let randomImgUrl = imgUrls[0];
                html += `
                    <div class = 'particle'><img src='${randomImgUrl}'></div>
                `;
            }
            this.layerEl.insertAdjacentHTML('beforeend', html);
        }
    }

    animate() {
        // Bo na starcie (w konstruktorze) dajemy opacity 0, by nam nic nie migało pomiędzy constructor - build - animate.
        this.layerEl.style['opacity'] = 1;

        if (this.ingredient.getType() === 'entire') {
            // Np. całe danie (ciasto, może talerz z zupką etc)

            this.layerEl.animate(
                [
                    {
                        // transform: 'rotate(0deg) translateX(-100%)'
                        transform: 'rotate(0deg)',
                        left: '-100%',
                        opacity: 0,

                    },
                    {
                        transform: 'rotate(360deg)',
                        left: '0%',
                        opacity: 1,
                        //transform: 'rotate(360deg) translateX(0%)'
                    }
                ], {
                duration: 1500,
                iterations: 1,
                easing: 'ease-out',
                fill: 'forwards',
            })
        } else if (this.ingredient.getType() === 'particles') {
            // Particles (np. pomidory).

            let mealSizeCategory = 'small';
            let particlesElems = this.layerEl.querySelectorAll('.particle');
            // Czy rozłożyć po wirtualnej "siatce", czyli tak naprawdę zaokrąglać poycje do np. 100, by
            // się np. pomidor na pomidorze nie układał.
            //let useGrid = false;

            // Konkretne predefiniowane pozycje, o ile są.
            let particlePositions = this.ingredient.getParticlesPositions(mealSizeCategory);
            // Czy mamy użyć predefiniowanych pozycji? Czy losowo? Jeśli są i to jest pierwsza warstwa
            // to owszem, w przeciwnym wypadku nie.
            let useParticlePositions = false;
            if (particlePositions && this.scene.getLayerCount(this.ingredient.name) <= 1) {
                useParticlePositions = true;
            }

            // Jednostka w przypadku pozycji - '%' lub 'px'
            const posUnit = 'px';
            let particleIndex = -1;
            particlesElems.forEach(particleEl => {
                let lParticle = l(particleEl);
                particleIndex++;

                // Info debuggowe.
                let dbg = '';

                // Losowa pozycja startowa.
                let startPos = { x: 0, y: 0 };
                if (Math.random() <= 0.5) {
                    startPos.x = -100;
                } else {
                    startPos.x = Utils.random(-300, this.scene.baseWidth() + 100);
                }
                startPos.y = Utils.random(-300, this.scene.baseHeight() + 100);

                // Pozycja końcowa.
                // Szer. albo wysokość elementu (tym samym obrazka) w particle. Zależy co większe.
                let particleElementMax = Math.max(particleEl.clientWidth, particleEl.clientHeight);
                
                
                dbg += `max: ${particleElementMax},`;
                let endPos = null;
                if (useParticlePositions) {
                    endPos = new LightScene.Point(particlePositions[particleIndex][0], particlePositions[particleIndex][1]);
                    endPos.substract(particleElementMax / 2);
                } else {
                    // Losowo.
                    // O ile zmniejszamy średnicę (o wielkość elementu, no i też dlatego, że nie daje się składników na samym brzegu ciasta)
                    let diameterDecrease = (particleElementMax) + (70 * 2);
                    //let diameterDecrease = 400;
                    let diameter = this.scene.baseWidth() - diameterDecrease;
                    dbg += `diameter: ${diameter}, `;

                    // Funkcja randomInsideCircle zakłada, że koło startuje x:0, y:0, więc jeśli zmieniliśmy nasz 'diameter'
                    // To potem musimy też przesunąć w dół/prawo nasz punkt.
                    let translateCircle = new LightScene.Point(diameterDecrease / 2, diameterDecrease / 2);

                    // Jeśli chodzi zaś o particle, to dodatkowo musimy uwzględnić fakt, że animacja popchnie jego 
                    // punkt top left. A więc będzie wszystko przesunięte w dół/lewo. Przesuwamy więc nasz punkt w górę/lewo
                    // o połowę jego rozmiaru.
                    let translateEndPos = new LightScene.Point(translateCircle);
                    translateEndPos.substract(particleEl.clientWidth / 2, particleEl.clientHeight / 2);

                    dbg += `translateEndPos: ${translateEndPos}, `;
                    endPos = new LightScene.Point(Utils.randomInsideCircle(diameter));
                    endPos.add(translateEndPos);


                    // Debuggowanie: rysowanie kółka z naszym 'diameter'
                    // if(this.isDevMode()){
                    //     this.scene.sceneEl.insertAdjacentHTML('beforeend', `
                    //     <div class = "circle"
                    //          style = "
                    //          z-index:100;position:absolute;
                    //          top:${translateCircle.x}px;left:${translateCircle.x}px;
                    //          width:${diameter}px;height:${diameter}px"
                    //     >
                    //     </div>
                    //     `);                        
                    // }
                }
                dbg += `x:${endPos.x}, y:${endPos.y},`;
                // Info stricte debuggowe.
                // if(this.isDevMode()){
                //     lParticle.attr('title',dbg)
                //     lParticle.on('mouseenter',()=>{
                //         lParticle.css({outline:'2px solid green','background-color':'red'});
                //     })
                //     lParticle.on('mouseleave',()=>{
                //         lParticle.css({outline:'none','background-color':null});
                //     })                    
                // }
                // if(this.isDevMode()){
                //     console.log(dbg);
                // }

                // if (useGrid) {
                //     endPos.x = Math.round(endPos.x / 200) * 200;
                //     endPos.y = Math.round(endPos.y / 200) * 200;
                //     endPos.add(Utils.random(-5,5));
                // }

                let rotation = Utils.random(1, 360);
                let duration = Utils.random(500, 1000);

                particleEl.animate(
                    [
                        {
                            // transform: 'rotate(0deg) translateX(-100%)'
                            transform: 'rotate(0deg)',
                            left: startPos.x + posUnit,
                            top: startPos.y + posUnit,
                            opacity: 0.5,
                            //scale: 1,
                        },
                        {
                            transform: `rotate(${rotation}deg)`,
                            left: endPos.x + posUnit,
                            top: endPos.y + posUnit,
                            opacity: 0.95,
                            //scale: 0.5,
                            //transform: 'rotate(360deg) translateX(0%)'
                        }
                    ], {
                    duration: duration,
                    iterations: 1,
                    easing: 'ease-out',
                    fill: 'forwards',
                })
            })
        }
    }

    /**
     * @param callback użyty by parent (Scene) usunąło też layer z wewn. arraya.
     */
    remove(callback) {
        let rotation = Utils.random(1, 360);
        let anim = this.layerEl.animate([
            {
                opacity: 0,
                //left: '-300px',        
                // transform: `rotate(${rotation}deg)`,
                // scale: 0.1,
            }
        ], {
            duration: 1000,
            fill: 'forwards',
        });

        anim.onfinish = () => {
            this.layerEl.remove();
            callback();
        }
    }

}

/**
 * Obsługa samej pizzy (bez menu), tzn. np. dodawanie nowych layers.
 */
Composer.Scene = class {

    constructor(composer, sceneContainer) {
        this.composer = composer;
        this.layers = [];
        this.sceneEl = this.composer.composerEl.querySelector(sceneContainer);

        // Aktualna skala (float) obliczona w this.scaleScene
        this.scale = null;

        // Rotacja całej sceny (Animation)
        this.sceneRotationAnim = null;
    }

    isDevMode() {
        return this.composer.isDevMode();
    }

    build() {
        window.addEventListener('resize', () => { this.scaleScene() });
        this.scaleScene();

        this.sceneEl.addEventListener('mousemove', (e) => {
            this.updateDevInfo(e);
        })

        // Animacja rotowania całości, obracanie, dish rotation.
        setTimeout(() => {
            //const parentEl = l(this.sceneEl).closest('.scene-wrapper')[0];
            this.sceneRotationAnim = this.sceneEl.animate(
                [
                    {
                        //transform: 'rotate(0deg)',
                    },
                    {
                        transform: 'rotate(360deg)',
                        //opacity:0.1,
                    }
                ], {
                duration: 1000 * 60 * 3,
                //iterations: 3,
                iterations: Infinity,

                easing: 'linear',
                //fill: 'forwards',
            })

            // W trybie prod włączamy animację, w trybie dev wyłączamy (wkurwia).
            if (this.isDevMode()){
                this.sceneRotationAnim.pause();
            }

        }, 0)

    }

    updateDevInfo(mouseEvent = null) {
        let info = '';
        info += `Scale: ${this.scale.toFixed(2)}`;

        if (mouseEvent) {
            var rect = mouseEvent.target.getBoundingClientRect();
            let x = mouseEvent.clientX - rect.left; //x position within the element.
            let y = mouseEvent.clientY - rect.top;  //y position within the element.
            // Uwzględniamy skalę
            x = (x * (1 / this.scale)).toFixed(0);
            y = (y * (1 / this.scale)).toFixed(0);
            info += ` X: ${x}, Y: ${y}`;
        }
        l('.dev-scene-info').text(info);
    }

    scaleScene() {
        const sceneWrapperEl = l(this.sceneEl).closest('.scene-wrapper')[0];
        const sceneScaleEl = l(this.sceneEl).closest('.scene-scale')[0];
        sceneWrapperEl.style.height = null;
        //const el = this.sceneEl;
        //const el = sceneScaleEl;

        let scale = 0;
        scale = Math.min(
            sceneWrapperEl.clientWidth / sceneScaleEl.clientWidth,
            sceneWrapperEl.clientHeight / sceneScaleEl.clientHeight
            // window.innerWidth / el[0].clientWidth,
            // window.innerHeight / el[0].clientHeight
        );

        // Skalowanie.
        this.scale = scale;
        sceneScaleEl.style['transform'] = `scale(${scale})`;

        // Kwestia wysokości.
        const elRect = sceneScaleEl.getBoundingClientRect();
        sceneWrapperEl.style.height = `${elRect.height}px`;

        // Kwestia centrowania.
        sceneWrapperEl.style['padding-left'] = `${(sceneWrapperEl.clientWidth - elRect.width) / 2}px`;

        // Update info dev.
        this.updateDevInfo();
    }

    width() {
        return this.sceneEl.clientWidth;
    }

    height() {
        return this.sceneEl.clientHeight;
    }

    // W przyszłości, gdy będzie np. zapiekanka, która jest dużo węższa niż cała scena, to tu jakoś rozróżnić. 
    // Ale co by nie było, do wszelkich obliczeń używać właśnie base...
    baseWidth() {
        return this.width();
    }

    // W przyszłości, gdy będzie np. zapiekanka, która jest dużo węższa niż cała scena, to tu jakoś rozróżnić. 
    // Ale co by nie było, do wszelkich obliczeń używać właśnie base...
    baseHeight() {
        return this.height();
    }

    baseRect() {
        return new LightScene.Rect({ x: 0, y: 0, width: this.baseWidth(), height: this.baseHeight() });
    }

    getLayers() {
        return this.layers;
    }

    /**
     * Ingredient to object
     */
    addLayer(ingredient) {
        // Tu konstruktor też zbuduje
        let layer = new Composer.Layer(this, ingredient);
        this.layers.push(layer);
        setTimeout(
            ()=>{layer.animate()},
            100
        )
        
    }

    removeLayer(index) {
        this.layers[index].remove(() => {
            //this.layers.splice(index,1);
        });
        // Closures, closures:)
        this.layers.splice(index, 1);
    }

    /**
     * Zwraca index ostatniego (domyślnie) layer z podanym składnikiem.
     * @param {string} name Nazwa produktu (np. 'tomato')
     * @param {bool} last: czy ostatni? Jeśli tak, to zwróci ostatni layer z tym składnikiem, jak false, to pierwszy
     * @returns {int} index layera w this.layers
     */
    getLayerIndex(name, last = true) {
        if (!last) {
            //this.layers.find(layer => layer.ingredient.name === name) || null;
            let foundIndex = null;
            this.layers.some((layer, index) => {
                if (layer.ingredient.name === name) {
                    foundIndex = index;
                    return true;// break
                }
            })
            return foundIndex;
        }
        // Mamy zwrócić ostatni, tak jest najprościej:
        for (var i = this.layers.length - 1; i >= 0; i--) {
            if (this.layers[i].ingredient.name === name) {
                return i;
            }
        }
        return null;
    }

    /**
     * 
     * @param {string} ingredientName Nazwa składnika
     * @param {bool} last Czy ostatni? Jeśli tak, to zwróci ostatni layer z tym składnikiem, jak false, to pierwszy
     * @returns Composer.layer
     */
    getLayer(ingredientName, last = true) {
        let index = this.getLayerIndex(ingredientName, last);
        if (index === null) {
            return null;
        }
        return this.layers[index];
    }

    /** Zwraca ile mamy layerów dla danego składnika na naszym daniu */
    getLayerCount(ingredientName) {
        let count = 0;
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].ingredient.name === ingredientName) {
                count++;
            }
        }
        return count;
    }
}

Composer.Menu = class {
    constructor(composer, menuContainer) {
        this.composer = composer;
        this.menuEl = this.composer.composerEl.querySelector(menuContainer);
        this.build();
    }

    build() {
        let html = '';
        let ingredientsBySections = this.composer.getIngredientsBySections();
        for (var sectionName in ingredientsBySections) {
            /**
             * @todo: ten warunek do usunięcia, to jest zrobione asap, trick.
             * Ciasto z reguły musi być, ale niekoniecznie w menu.
             */
            if(sectionName === 'Ciasto'){
                continue;
            }
            let ingredients = ingredientsBySections[sectionName];
            html += `
                <div class = 'menu-section'>
                    <span class = "menu-section-label">${sectionName}</span>
                    <div class = "menu-section-content">
                        <ul>
            `;
            ingredients.forEach((ingredient, index) => {
                html += `
                <li class = 'menu-ingredient' data-ingredient-index = '${index}' data-ingredient-name = '${ingredient.name}'>
                    <!-- <img src = '${ingredient.getThumbUrl()}'> -->
                    <span class = 'menu-ingredient-change menu-ingredient-minus'><span class="fas fa-minus"></span></span>
                    <span class = 'menu-ingredient-name'>
                        ${ingredient.display.pl}
                        <span class = 'menu-ingredient-count'></span>
                    </span>
                    <span class = 'menu-ingredient-change menu-ingredient-plus'><span class="fas fa-plus"></span></span>
                    <br class = 'clear-fix'>
                `
            });
            html += `</ul></div></div>`;
        }

        // Trochę trickowe. W powyższy sposób wrzucamy whitespaces np. po <span> - to tu je usuwamy,
        // Ale oczywiście nie jeśli są w środku słowa, a jedynie tuż po >.
        let htmlNoStupidWhitespaces = html.replace(/>(\s)*/gi, '>');
        this.menuEl.insertAdjacentHTML('beforeend', htmlNoStupidWhitespaces);

        ////////
        // Robimy sobie z tego wszystkiego Accordion

        l(this.menuEl).on('click', (e) => {
            let lMenu = l(e.target).closest('.menu');
            let lLabel = l(e.target).closest('.menu-section-label');
            if (lLabel.length == 0) {
                return;
            }
            // Tak, to jest nasz przycisk 'label'
            let lSection = lLabel.closest('.menu-section');
            let sectionEl = lSection[0];
            let lContent = lSection.find('.menu-section-content');

            // Wstępnie zamykamy wszystkie (poza klikniętym).
            lMenu.find('.menu-section').forEach(tmpSectionEl => {
                let tmpContentEl = l(tmpSectionEl).find('.menu-section-content')[0];
                l(tmpSectionEl).removeClass('menu-section-active');
                if (tmpSectionEl !== lSection[0] && tmpContentEl.style.maxHeight) {
                    tmpContentEl.style.maxHeight = null;
                };
            })

            // A teraz ten kliknięty rozwijamy albo zwijamy.
            if (lContent.length > 0) {
                let contentEl = lContent[0];
                if (contentEl.style.maxHeight) {
                    contentEl.style.maxHeight = null;
                } else {
                    lSection.addClass("menu-section-active");
                    contentEl.style.maxHeight = contentEl.scrollHeight + "px";
                }
            }
        })

        ////////
        // Reakcja na klik w ingredient (plus albo minus)
        l(this.menuEl).find('.menu-ingredient').on('click', (e) => {
            //this.onClick(l(e.target).closest('li .menu-ingredient-change'));
            this.onClick(l(e.target));
        })
    }

    /** 
     * Przekazujemy zdarzenie do composera, on doda warstwę.
     * Nota bene, 'composer' wróci do nas wywołując 'updateCalculations'
     */
    onClick(lElement) {
        this.composer.onMenuClick(lElement);
    }

    /**
     * Tzn. ile jest danego składnika (warstw), by zrobić np. "Pomidory x3"
     * Wywoływane tak naprawdę przez Composer.
     * @returns float sumę (jakby kogoś interesowało)
     */
    updateCalculations() {
        let totalCost = 0;
        // @Todo, trick, cena wstępna powina wynikać z jsona
        totalCost = 12;
        l(this.menuEl).find('.menu-ingredient').each((lMenuIngredient) => {
            let ingredientName = lMenuIngredient.attr('data-ingredient-name');
            let ingredientCount = this.composer.scene.getLayerCount(ingredientName);
            let ingredient = this.composer.getIngredientByName(ingredientName);
            if (ingredientCount) {
                // Więcej niż jeden
                lMenuIngredient.find('.menu-ingredient-count').text(` x${ingredientCount}`);
                totalCost += ingredient.price * ingredientCount;
            } else {
                // Ten składnik nie został wybrany

                lMenuIngredient.find('.menu-ingredient-count').text('');
            }
        });
        return totalCost;
    }
}
/**
 * Wszystko dotyczące procesu przygotowania pizzy. Czy łącznie z menu, ale bez np. koszyka czy zamówienia
 */
Composer.Composer = class {
    /**
     * build: czy od razu zbudować (dodać ingredients z 'autoadd')
     */
    constructor(app, composerContainer, build = true) {
        this.app = app;
        // "Uklasowione" data.ingredients (tzn. z prostuch obiektów w instancje klasy Composer.Ingredients, która dodaje parę metod)
        this.ingredients = [];
        this.app.data.ingredients.forEach(ingredientBasic => {
            let ingredient = new Composer.Ingredient(app, ingredientBasic);
            this.ingredients.push(ingredient);
        })

        // Pizza plus menu.
        this.composerEl = this.app.appEl.querySelector(composerContainer);

        this.scene = new Composer.Scene(this, '.scene');
        this.menu = new Composer.Menu(this, '.menu');

        // Ostatnia akcja na menu ('ingredientMinus', 'ingredientPlus', może coś innego w przyszł.)
        this.menuLastAction = null;

        // Animacja (web animation) ceny (naklejki), aktualny obrót.
        this.dishPriceAnimCurDeg = 0;

        if (build) {
            this.build();
        }
    }

    isDevMode() {
        return this.app.isDevMode();
    }

    build() {
        // Z automatu dodajemy tylko te z 'autoadd'
        this.ingredients.forEach(ingredient => {
            if (ingredient.hasMode('autoadd')) {
                this.addLayer(ingredient);
            }
        })
        this.scene.build();
    }

    /**
     * Info od Composer.Menu.
     * lMenuItem - kliknięty element menu (<... class = '.menu-ingredient'> + jakieś jego dziecko)
     * Zajmujemy się tym **my** (composer) a nie klasa Menu, bo ta za mało wie (a tu trzeba np. rzucić składniki na danie)
     */
    onMenuClick(lMenuItem) {
        // Element li, tu mamy parę danych.
        let lMenuIngredient = lMenuItem.closest('.menu-ingredient');
        //let ingredientIndex = lMenuIngredient.attr('data-ingredient-index');
        let ingredientName = lMenuIngredient.attr('data-ingredient-name');
        let ingredient = this.getIngredientByName(ingredientName);
        if (ingredient !== null) {
            // Czy cokolwiek sensownego user kliknął?
            let clickProcessed = false;
            if (
                lMenuItem.closest('.menu-ingredient-change').is('.menu-ingredient-plus')
                || lMenuItem.closest('.menu-ingredient-name').length > 0
            ) {
                this.addLayer(ingredient);
                clickProcessed = true;
                this.menuLastAction = 'ingredientPlus';
            } else if (lMenuItem.closest('.menu-ingredient-change').is('.menu-ingredient-minus')) {
                let index = this.scene.getLayerIndex(ingredientName, true);
                if (index !== null) {
                    this.scene.removeLayer(index);
                }
                clickProcessed = true;
                this.menuLastAction = 'ingredientMinus';
            }
            if (clickProcessed) {
                // Update ceny, ilości w menu etc.
                this.updateCalculations();
            }
        }

    }

    /**
     * Zwraca array z instancjami Composer.Ingredient (które są budowane na podst. przekazanych data.ingredients)
     * @returns array
     */
    getIngredients() {
        return this.ingredients;
    }

    getIngredientsBySections() {
        let ingredients = this.getIngredients();
        let result = {};
        ingredients.forEach(ingredient => {
            let sectionName = typeof ingredient.section === 'undefined' ? 'Dodatki' : ingredient.section.pl;
            if (typeof result[sectionName] === 'undefined') {
                result[sectionName] = [];
            }
            result[sectionName].push(ingredient);
        })
        return result;
    }

    /**
     * Zwraca produkt po nazwie.
     * @param {string} name Nazwa produktu (np. 'tomato')
     * @returns object
     */
    getIngredientByName(name) {
        return this.getIngredients().find(ingredient => ingredient.name === name) || null;
    }

    /**
     * Doda layer.
     * @param object ingredient (ingredient z this.ingredients)
     */
    addLayer(ingredient) {
        this.scene.addLayer(ingredient);
    }

    /**
     * To po to by ewentualnie pokazać progressbar ładowania, ale też i po to, by móc pobierać rozmiary obrazka.
     * A jak nie są załadowane, no to nie pobierzemy.
     * callback: function (currentCounter, total, currentUrl);
     */
    prefetchIngredientsImages(callback) {
        let allImgUrls = [];
        this.ingredients.forEach((ingredient, index) => {
            let imgUrls = ingredient.getImageUrls();
            allImgUrls = [...allImgUrls, ...imgUrls];
        })
        let counter = 0;
        allImgUrls.forEach(imgUrl => {
            let image = new Image();
            image.src = imgUrl;
            image.onload = () => {
                counter++;
                callback(counter, allImgUrls.length, imgUrl);
            };
        })
    }

    /**
     * Zwróci cenę za wszystkie produkty.
     */
    getPrice() {
        let layers = this.scene.getLayers();
        let price = 0;
        layers.forEach(layer => {
            price += typeof layer.ingredient.price === 'undefined' ? 0 : layer.ingredient.price;
        })
        return price;
    }

    /**
     * Rekalkulacja ilości wybranych składników w menu oraz finalnej ceny.
     */
    updateCalculations() {
        let totalPrice = this.menu.updateCalculations();
        // @now
        this.app.appEl.querySelector('.dish-price .dish-price-price').textContent = (parseFloat(totalPrice)).toFixed(2).toString().replaceAll('.', ',');

        // Animacja naklejki z ceną
        let nextDishPriceAnimCurDeg = this.dishPriceAnimCurDeg;
        if (this.menuLastAction === 'ingredientPlus') {
            nextDishPriceAnimCurDeg += 5;
        } else if (this.menuLastAction === 'ingredientMinus') {
            nextDishPriceAnimCurDeg -= 5;
        }
        this.app.appEl.querySelector('.dish-price .dish-price-img').animate([
            {
                transform: `rotate(${this.dishPriceAnimCurDeg}deg)`,
            },
            {
                transform: `rotate(${nextDishPriceAnimCurDeg}deg)`,
            }
        ], {
            duration: 300,
            iterations: 1,
            easing: 'ease-out',
            fill: 'forwards',
            //animationDirection: "alternate-reverse"
        });

        this.dishPriceAnimCurDeg = nextDishPriceAnimCurDeg;
    }
}

/**
 * Główna aplikacja, tu jest wszystko.
 */
class App {
    /** container: cały div dla wszystkiego, composer pizzy, łącznie z np. formularzem zw. z płaceniem */
    constructor(props) {
        this.data = props.data;
        // Ustawi dynamicznie url do np. http://local.yummy/app, po to by go pobierać (np. przy zdjęciach)
        this.setupUrl();
        this.setupStyle();
        this.setupDevMode();
        this.appEl = props.container instanceof Node ? props.container : document.querySelector(props.container);

        this.composer = new Composer.Composer(this, '.composer-container', false);

        // Testy:
        console.log('uparam:', this.getUrlParam('devMode'));

        // To potem jakoś inaczej:
        let priceImage = new Image();
        priceImage.src = './assets/images/dish-price.png';
        this.composer.prefetchIngredientsImages((count, total, url) => {
            let percent = Math.round(100 / (total / (count ? count : 1)));
            l('.loader-progress').text(`Loading: ${percent}%`);

            // Czy wszystko załadowane?
            if (count === total) {

                // Znikniemy loader
                let anim = l('.loader')[0].animate([
                    { opacity: 0 }
                ], {
                    duration: 400,
                    fill: 'forwards',
                });

                // A gdy ta operacja się zakończy, to budujemy wszystko (i jeśli trzeba to animujemy)
                anim.onfinish = () => {
                    l('.loader')[0].remove();
                    this.composer.composerEl.style['display'] = 'block';
                    this.composer.build();
                    this.composer.updateCalculations();
                    // Poniższe trzeba gdzieś wyrzucić do czegoś, albo w ogóle zrobić ogólny loader
                    // wszystkich obrazów. To jest tu chwilowo.
                    let animateDishPrice = () => {
                        setTimeout(() => {
                            l('.dish-price')[0].animate([
                                {
                                    // Dziwne ale owszem, to prawa krawędź jest więc będzie w ... prawo, dlatego wjedzie z lewa, haha
                                    // right:'-50%',
                                    // top:'-50%',
                                    // opacity:0.80,
                                    scale: 0.0,
                                    opacity: 1,
                                    //transform: 'rotate(360deg) translateX(0%)'

                                },
                                {
                                    // opacity:0.95,
                                    // right:'1%',
                                    // top:'1%',
                                    scale: 1,
                                    opacity: 1,
                                    transform: 'rotate(360deg) translateX(0%)'
                                }
                            ], {
                                duration: 500,
                                fill: 'forwards',
                                easing: 'ease-out',
                            });
                        }, 1500);
                    }
                    if (priceImage.complete && priceImage.naturalHeight !== 0) {
                        animateDishPrice();
                    } else {
                        priceImage.onload = () => {
                            animateDishPrice();
                        }
                    }
                }
            }
        });

        // Actions
        l('.actions-ready').on('click', () => {
            alert('Zamówienie zostało zrealizowane');
        })



    }

    // Ustawia url do aplikacji (this.url, np.http://local.yummy/app)
    setupUrl() {
        // Weźmiemy sobie 'appUrl' ze ścieżki nas samych.
        let scriptSrc = Composer.currentScript.src;
        if (!scriptSrc) {
            debugger;
        }

        // Jeśli cała ścieżka kończy się slashem (bo może, chociaż niekoniecznie w tym przypadku) do go ucinamy.
        if (scriptSrc[scriptSrc.length - 1] === '/') {
            scriptSrc = scriptSrc.slice(0, -1);
        }

        // Bierzemy wszystko z wyjątkiem dwóch ostatnich elementów (czyli z  http://local.yummy/app/src/app.js ucinamy /src/app.js)
        this.url = scriptSrc.split('/').slice(0, -2).join('/');
    }



    // Włączenie potencjalnego trybu 'dev', na podstawie tego, czy jest local.yummy (mój - Konrada), czy może 
    // w url jest devMode=true. To drugie nadpisuje wszystko inne.
    setupDevMode() {
        this.devMode = false;
        let iFrameSrc = window.location.href;
        if (iFrameSrc.indexOf('://local.yummy') !== -1) {
            this.devMode = true;
        }

        // Jednakże to co znajdziemy w parametrach (url) nadpisuje wszystko.
        const urlDevMode = this.getUrlParam('devMode');
        // Potencjalny parametr 'devMode' w url'u parenta
        if(urlDevMode === 'true' || urlDevMode == 1){
            this.devMode = true;
        }else if(urlDevMode === 'false' || urlDevMode == 0){
            this.devMode = false;
        }
        
        if (this.isDevMode()) {

            this.data.ingredients.push(
                {
                    "name": "dev-point-square",
                    "display": { "pl": "Kwadraty (10x10px)" },
                    "section": { "pl": "Developer" },
                    "count": 100,
                    "zIndex": 50,
                    "price": 1,
                },
                {
                    "name": "dev-point-circle",
                    "display": { "pl": "Koła (20x20px)" },
                    "section": { "pl": "Developer" },
                    "count": 100,
                    "zIndex": 50,
                    "price": 1,
                }
            );

            l('.dev-smoke-active').on('change', () => {
                if (l('.dev-smoke-active')[0].checked) {
                    l('.scene-wrapper .smoke').css('display', 'block');
                    l('.scene-wrapper .smoke video')[0].play();
                } else {
                    l('.scene-wrapper .smoke').css('display', 'none');
                    l('.scene-wrapper .smoke video')[0].pause();
                }
            })

            l('.dev-scene-rotation-active').on('change', () => {
                if (this.composer.scene.sceneRotationAnim) {
                    if (l('.dev-scene-rotation-active')[0].checked) {
                        this.composer.scene.sceneRotationAnim.play();
                    } else {
                        this.composer.scene.sceneRotationAnim.pause();
                    }
                } else {
                    alert('Not started yet (3s)');
                }
            })
        } else {
            // Nie dev mode.

            // Ukrywamy cały panel devloper.
            l('.developer').css('display','none');
        }
    }

    // Załadowanie potencjalnego stylu z urla.
    setupStyle(){
        let urlStyle = this.getUrlParam('style');
        if(urlStyle){
            l('head').insertAdjacentHTML('beforeend', `
                <link rel="stylesheet" href="./assets/css/themes/${urlStyle}.css">

        `);
        }
    }

    /**
     * Zwróci parametr w URL (np. '?style=dark'). Wpierw bierze z parenta i jeśli jest określony to nadpisuje cokolwiek innego
     * Potem z embedda.
     */
    getUrlParam(paramName, defaultValue = null){
        let resultValue = null;

        // Wpierw próbujemy url parenta (który osadza nasz embed)
        // Go może nie być z różnych powodów (CORS).
        const parentUrlStr = (window.location != window.parent.location) ? document.referrer : document.location.href;
        if (parentUrlStr){
            let url = new URL(parentUrlStr);
            const paramUrlVal = url.searchParams.get(paramName);  
            if (paramUrlVal !== null){
                resultValue = paramUrlVal;
            }
        }

        // Nie ma w parencie?
        if (resultValue === null){
            let url = new URL(document.location.href);
            const paramUrlVal = url.searchParams.get(paramName);  
            if (paramUrlVal !== null){
                resultValue = paramUrlVal;
            }
        }

        if(resultValue === null){
            return defaultValue;
        }
        return resultValue;
    }

    isDevMode() {
        return this.devMode === true;
    }    
}
