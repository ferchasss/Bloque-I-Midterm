///////// SCAFFOLD.
// 1. Importar librerías.
console.log(THREE);
console.log(gsap);

// 2. Configurar canvas.
const canvas = document.getElementById("lienzo");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 3. Configurar escena 3D.
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);
renderer.setClearColor("#63280a");
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);



// 3.1 Configurar mesh.
 //const geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 5, 2);
 const geo = new THREE.SphereGeometry(1.5, 128, 128);

const material = new THREE.MeshStandardMaterial({
    color: "#ffffffff",
    //lineas geometria
  //  wireframe: true,
});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);
mesh.position.z = -7;

// 3.2 Crear luces.
const frontLight = new THREE.PointLight("#110c07ff", 300, 100);
frontLight.position.set(7, 3, 3);
scene.add(frontLight);

const rimLight = new THREE.PointLight("#e1741a", 50, 100);
rimLight.position.set(-7, -3, -7);
scene.add(rimLight);

//luz ambiental
const ambientLight = new THREE.AmbientLight("#ea7d3e", 0.5); 
scene.add(ambientLight);
///////// EN CLASE.


//// A) Cargar múltiples texturas.
// 1. "Loading manager".
const manager = new THREE.LoadingManager();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
   console.log(`Iniciando carga de: ${url} (${itemsLoaded + 1}/${itemsTotal})`);
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
   console.log(`Cargando: ${url} (${itemsLoaded}/${itemsTotal})`);
};

manager.onLoad = function () {
   console.log('✅ ¡Todas las texturas cargadas!');
   createMaterial();
};

manager.onError = function (url) {
   console.error(`❌ Error al cargar: ${url}`);
};
// 2. "Texture loader" para nuestros assets.
const loader = new THREE.TextureLoader(manager);

// 3. Cargamos texturas guardadas en el folder del proyecto.
const metaltextura = {
   albedo: loader.load('./assets/texturas/metal/futuristic-cube-metal_albedo.png'),
   ao: loader.load('./assets/texturas/metal/futuristic-cube-metal_ao.png'),
  // metalness: loader.load('./assets/texturas/metal/.png'),
   normal: loader.load('./assets/texturas/metal/futuristic-cube-metal_normal-ogl.png'),
  // roughness: loader.load('./assets/texturas/metal/roughness.png'),
   displacement: loader.load('./assets/texturas/metal/futuristic-cube-metal_height.png'),

};

const rustedTextures = {
   albedo: loader.load('./assets/texturas/rusted/albedo.png'),
   metalness: loader.load('./assets/texturas/rusted/metallic.png'),
   normal: loader.load('./assets/texturas/rusted/normal.png'),
   roughness: loader.load('./assets/texturas/rusted/roughness.png'),
};
const eyeTextures = {
    albedo: loader.load('./assets/texturas/eye/IRIS_FINAL_baseColor.jpeg'), // color del iris
    normalMap: loader.load('./assets/texturas/eye/CORNEA_normal.png'), // relieve de la córnea
    roughnessMap: loader.load('./assets/texturas/eye/IRIS_FINAL_metallicRoughness.png'), // canal verde
    metalnessMap: loader.load('./assets/texturas/eye/IRIS_FINAL_metallicRoughness.png'), // canal rojo


};
const sandTextures = {
   albedo: loader.load('./assets/texturas/sand/sand-dunes1_albedo.png'),
   ao: loader.load('./assets/texturas/sand/sand-dunes1_ao.png'),
   //metalness: loader.load('./assets/texturas/metal/.png'),
   normal: loader.load('./assets/texturas/sand/sand-dunes1_normal-ogl.png'),
   //roughness: loader.load('./assets/texturas/metal/roughness.png'),
   displacement: loader.load('./assets/texturas/sand/sand-dunes1_height.png'),

};
// 4. Definimos variables y la función que va a crear el material al cargar las texturas.
var metalmaterial;
var rustedMaterial;
var eyeMaterial;
var sandMaterial;

function createMaterial() {
    // 1 Crear materiales
    metalmaterial = new THREE.MeshStandardMaterial({
        map: metaltextura.albedo,
        aoMap: metaltextura.ao,
        normalMap: metaltextura.normal,
        displacementMap: metaltextura.displacement,
        displacementScale: 0.2,
        side: THREE.FrontSide,
        metalness: 1,
        roughness: 0.2,
    });

    rustedMaterial = new THREE.MeshStandardMaterial({
        map: rustedTextures.albedo,
        metalnessMap: rustedTextures.metalness,
        normalMap: rustedTextures.normal,
        roughnessMap: rustedTextures.roughness,
        metalness: 1,
        roughness: 1,
        side: THREE.DoubleSide,
    });

    eyeMaterial = new THREE.MeshStandardMaterial({
        map: eyeTextures.albedo,        // color del iris
        normalMap: eyeTextures.normalMap, // normal de la córnea
        roughnessMap: eyeTextures.roughnessMap,
        metalnessMap: eyeTextures.metalnessMap,
        metalness: 1,
        roughness: 1,
        side: THREE.DoubleSide,
    });
      sandMaterial = new THREE.MeshStandardMaterial({
         map: sandTextures.albedo,
         aoMap: sandTextures.ao,
         normalMap: sandTextures.normal,
         displacementMap: sandTextures.displacement,
         displacementScale: 0.2,
         side: THREE.FrontSide,
         metalness: 0.3,
         roughness: 1,
         side: THREE.DoubleSide,
     });
                mesh.material = metalmaterial;
                mesh.material = rustedMaterial;
               mesh.material = eyeMaterial;
               mesh.material = sandMaterial;
           




//// B) Rotación al scrollear.
// 1. Crear un objeto con la data referente al SCROLL para ocuparla en todos lados.
var scroll = {
   y: 0,
   lerpedY: 0,
   speed: 0.005,
   cof: 0.07
};

// 2. Escuchar el evento scroll y actualizar el valor del scroll.
function updateScrollData(eventData) {
   scroll.y += eventData.deltaX * scroll.speed;
}

window.addEventListener("wheel", updateScrollData);

// 3. Aplicar el valor del scroll a la rotación del mesh. (en el loop de animación)
function updateMeshRotation() {
   mesh.rotation.y = scroll.lerpedY;
   mesh.rotation.y = scroll.lerpedY;
}
// 5. Vamos a suavizar un poco el valor de rotación para que los cambios de dirección sean menos bruscos.
function lerpScrollY() {
   scroll.lerpedY += (scroll.y - scroll.lerpedY) * scroll.cof;
}


//// C) Movimiento de cámara con mouse (fricción) aka "Gaze Camera".
// 1. Crear un objeto con la data referente al MOUSE para ocuparla en todos lados.
var mouse = {
   x: 0,
   y: 0,
   normalOffset: {
       x: 0,
       y: 0
   },
   lerpNormalOffset: {
       x: 0,
       y: 0
   },

   cof: 0.07,
   gazeRange: {
       x: 7,
       y: 3  
   }
}
// 2. Leer posición del mouse y calcular distancia del mouse al centro.
function updateMouseData(eventData) {
   updateMousePosition(eventData);
   calculateNormalOffset();
}
function updateMousePosition(eventData) {
   mouse.x = eventData.clientX;
   mouse.y = eventData.clientY;
}
function calculateNormalOffset() {
   let windowCenter = {
       x: canvas.width / 2,
       y: canvas.height / 2,
   }
   mouse.normalOffset.x = ( (mouse.x - windowCenter.x) / canvas.width ) * 2;
   mouse.normalOffset.y = ( (mouse.y - windowCenter.y) / canvas.height ) * 2;
}

    function lerpDistanceToCenter() {
   mouse.lerpNormalOffset.x += (mouse.normalOffset.x - mouse.lerpNormalOffset.x) * mouse.cof;
   mouse.lerpNormalOffset.y += (mouse.normalOffset.y - mouse.lerpNormalOffset.y) * mouse.cof;
}

window.addEventListener("mousemove", updateMouseData);


// 3. Aplicar valor calculado a la posición de la cámara. (en el loop de animación)
function updateCameraPosition() {
   camera.position.x = mouse.lerpNormalOffset.x * mouse.gazeRange.x;
   camera.position.y = -mouse.lerpNormalOffset.y * mouse.gazeRange.y;
}



///////// FIN DE LA CLASE.






/////////
// Final. Crear loop de animación para renderizar constantemente la escena.
function animate() {
    requestAnimationFrame(animate);

   //mesh.rotation.x -= 0.005;
   lerpScrollY()
 updateMeshRotation();
 lerpDistanceToCenter();
 updateCameraPosition();
  camera.lookAt(mesh.position);
    renderer.render(scene, camera);
}

animate();

 canvas.addEventListener("click", () => {
   gsap.to(mesh.scale, {
         x:mesh.scale.x + 0.3,
         y:mesh.scale.y + 0.3,
         z:mesh.scale.z + 0.3,
         duration: .2,
         ease: "bounce.out",
   });
});
}
document.getElementById('rustedButton').addEventListener('click', function() {
    mesh.material = rustedMaterial;
});

document.getElementById('metalButton').addEventListener('click', function() {
    mesh.material = metalmaterial;
});

document.getElementById('sandButton').addEventListener('click', function() {
    mesh.material = sandMaterial;
});

// Usando tu loader existente
const cubeTextures = [
    loader.load('./assets/background/1190503.jpg'), // +X
    loader.load('./assets/background/1190503.jpg'), // 
    loader.load('./assets/background/1190503.jpg'), // +Y arriba
    loader.load('./assets/background/1190503.jpg'), // -Y
    loader.load('./assets/background/1190503.jpg'), // +Z
    loader.load('./assets/background/1190503.jpg'), // -Z frente
];

// Crear materiales para cada cara

const cubeMaterials = cubeTextures.map(tex => {
    tex.encoding = THREE.sRGBEncoding; // colores correctos
    return new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide });
});
// Crear geometría y cubo
const geometry = new THREE.BoxGeometry(100, 100, 100);
const cube = new THREE.Mesh(geometry, cubeMaterials);
scene.add(cube);

// Opcional: mover el cubo detrás de la escena si quieres
cube.position.set(0, 0, -50);

cubeTextures.forEach(tex => {
    tex.encoding = THREE.sRGBEncoding;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
});

window.addEventListener('keydown', (event) => {
    // Verifica que la tecla presionada sea "W" (mayúscula o minúscula)
    if (event.key === 'w' || event.key === 'W') {
        // Cambia el modo wireframe del material actual
        mesh.material.wireframe = !mesh.material.wireframe;
    }
});