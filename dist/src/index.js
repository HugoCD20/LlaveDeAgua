var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
//import { Input } from './Input.js';
import { Obj3D } from './Obj3D.js';
//import { Canvas3D } from './Canvas3D.js';
//import { CvWireframe } from './CvWireFrame.js';
import { CvHLines } from './CvHLines.js';
import { Rota3D } from './Rota3D.js';
let canvas;
let graphics;
canvas = document.getElementById('circlechart');
graphics = canvas.getContext('2d');
let cv;
let obj;
let ang = 0;
let vueltas = 0;
window.addEventListener('DOMContentLoaded', () => {
    // Simular carga de archivo al iniciar
    fetch('./1aallave.txt') // Ruta relativa al archivo
        .then(response => response.text())
        .then(contenido => {
        obj = new Obj3D();
        if (obj.read(contenido)) {
            cv = new CvHLines(graphics, canvas);
            cv.setObj(obj);
            cv.paint();
        }
    })
        .catch(error => {
        console.error('Error al cargar el archivo:', error);
    });
});
function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        obj = new Obj3D();
        if (obj.read(contenido)) {
            //sDir = sDir1;
            cv = new CvHLines(graphics, canvas);
            cv.setObj(obj);
            cv.paint();
        }
    };
    lector.readAsText(archivo);
}
function vp(dTheta, dPhi, fRho) {
    if (obj != undefined) {
        let obj = cv.getObj();
        if (!obj.vp(cv, dTheta, dPhi, fRho))
            alert('datos no validos');
    }
    else
        alert('aun no has leido un archivo');
}
function eyeDownFunc() {
    vp(0, 0.1, 1);
}
function eyeUpFunc() {
    vp(0, -0.1, 1);
}
function eyeLeftFunc() {
    vp(-0.1, 0, 1);
}
function eyeRightFunc() {
    vp(0.1, 0, 1);
}
function incrDistFunc() {
    vp(0, 0, 2);
}
function decrDistFunc() {
    vp(0, 0, 0.5);
}
function pza1DerFunc() {
    let af = -45;
    const output = document.getElementById('output');
    output.innerText = `Paso ${vueltas + 1}`;
    Rota3D.initRotate(obj.w[651], obj.w[652], af * Math.PI / 180);
    if (vueltas < 14) {
        for (let i = 500; i <= 650; i++) {
            obj.w[i] = Rota3D.subir(obj.w[i]);
        }
        cv.setObj(obj);
        cv.paint();
        vueltas++;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function abrir() {
    return __awaiter(this, void 0, void 0, function* () {
        const btns = document.querySelectorAll("button");
        btns.forEach(b => b.setAttribute("disabled", "true"));
        for (let i = 0; i < 14; i++) {
            pza1DerFunc();
            if (vueltas < 14) {
                yield sleep(500); // espera 1 segundo
            }
        }
        btns.forEach(b => b.removeAttribute("disabled"));
    });
}
function cerrar() {
    return __awaiter(this, void 0, void 0, function* () {
        const btns = document.querySelectorAll("button");
        btns.forEach(b => b.setAttribute("disabled", "true"));
        for (let i = 0; i < 14; i++) {
            pza1IzqFunc();
            if (vueltas > 0) {
                yield sleep(500); // espera 1 segundo
            }
        }
        btns.forEach(b => b.removeAttribute("disabled"));
    });
}
function pza1IzqFunc() {
    let af = 45;
    const output = document.getElementById('output');
    output.innerText = `Paso ${vueltas + 1}`;
    Rota3D.initRotate(obj.w[651], obj.w[652], af * Math.PI / 180);
    if (vueltas > 0) {
        for (let i = 500; i <= 650; i++) {
            obj.w[i] = Rota3D.bajar(obj.w[i]);
        }
        cv.setObj(obj);
        cv.paint();
        vueltas--;
    }
}
//movimiento de piezas
(_a = document.getElementById('abrir')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', abrir);
(_b = document.getElementById('cerrar')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', cerrar);
document.getElementById('izquierda').addEventListener('click', pza1IzqFunc, false);
document.getElementById('derecha').addEventListener('click', pza1DerFunc, false);
let Pix, Piy;
let Pfx, Pfy;
let theta = 0.3, phi = 1.3, SensibilidadX = 0.02, SensibilidadY = 0.02;
let flag = false;
function handleMouse(evento) {
    Pix = evento.offsetX;
    Piy = evento.offsetY;
    flag = true;
}
function makeVizualization(evento) {
    if (flag) {
        Pfx = evento.offsetX;
        Pfy = evento.offsetY;
        //console.log(Pfx, Pfy)
        let difX = Pix - Pfx;
        let difY = Pfy - Piy;
        vp(0, 0.1 * difY / 50, 1);
        Piy = Pfy;
        vp(0.1 * difX, 0 / 50, 1);
        Pix = Pfx;
        /*if( Piy>Pfy+1 ){
          phi += SensibilidadY;
          vp(0, 0.1*, 1);
          //cv.redibuja(theta, phi, tamanoObjeto);
          Piy=Pfy;
        }
    
        if(Pfy>Piy+1){
          phi -= SensibilidadY;
          vp(0,-0.1, 1);
          //cv.redibuja(theta, phi, tamanoObjeto);
          Piy=Pfy;
        }*/
        /*if (Pix > Pfx + 1) {
          theta += SensibilidadX;
          vp(0.1, 0, 1);
          //cv.redibuja(theta, phi, tamanoObjeto);
          Pix = Pfx;
        }
            
        if (Pfx > Pix + 1) {
          theta -= SensibilidadX;
          vp(-0.1, 0, 1);
          //cv.redibuja(theta, phi, tamanoObjeto);
          Pix = Pfx;
        }*/
    }
}
function noDraw() {
    flag = false;
}
canvas.addEventListener('mousedown', handleMouse);
canvas.addEventListener('mouseup', noDraw);
canvas.addEventListener('mousemove', makeVizualization);
