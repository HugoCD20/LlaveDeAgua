
//import { Input } from './Input.js';
import { Obj3D } from './Obj3D.js';
//import { Canvas3D } from './Canvas3D.js';
//import { CvWireframe } from './CvWireFrame.js';
import { CvHLines } from './CvHLines.js';
import { Rota3D } from './Rota3D.js';
import { Point3D } from './point3D.js';

let canvas: HTMLCanvasElement;
let graphics: CanvasRenderingContext2D;

canvas = <HTMLCanvasElement>document.getElementById('circlechart');
graphics = canvas.getContext('2d');

let cv: CvHLines;
let obj: Obj3D;
let ang: number=0;
let vueltas: boolean = false;

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
        esfera();
      }
    })
    .catch(error => {
      console.error('Error al cargar el archivo:', error);
    });
});



function vp(dTheta:number, dPhi:number, fRho:number):void{  // Viewpoint
  if (obj != undefined) {
    let obj: Obj3D = cv.getObj();
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
  let af = 0;
	Rota3D.initRotate( obj.w[651], obj.w[652], af*Math.PI/180);	
    for (let i = 500; i <= 816; i++){
      obj.w[i] = Rota3D.subir(obj.w[i]);
    }
    cv.setObj(obj);
    cv.paint();	
}
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pza1IzqFunc() {
  let af = 90;
  const output = document.getElementById('output');
  output.innerText = `Abierto`;
  if (!vueltas) {
    Rota3D.initRotate( obj.w[651], obj.w[652], af*Math.PI/180);	
    for (let i = 500; i <= 816; i++){
      obj.w[i] = Rota3D.bajar(obj.w[i]);
    }
    cv.setObj(obj);
    cv.paint();	
    vueltas = true;
  }
}
function pza1IzqFunc2() {
  let af = 90;
  const output = document.getElementById('output');
  output.innerText = `Cerrado`;
  if (vueltas) {
    Rota3D.initRotate( obj.w[651], obj.w[652], af*Math.PI/180);	
    for (let i = 500; i <= 816; i++){
      obj.w[i] = Rota3D.bajar(obj.w[i]);
    }
    cv.setObj(obj);
    cv.paint();	
    vueltas = false;
  }
}

function esfera(){//la propuesta es que en el ciclo for se guarde la posicion de los nuevos puntos generados
  let af = 22.5;
  Rota3D.initRotate( obj.w[651], obj.w[652], af*Math.PI/180);
    for (let i = 657; i <= 796; i++){
      obj.w[i+20] = Rota3D.rota(obj.w[i]);
    }
    Rota3D.initRotate( obj.w[817], obj.w[818], 90*Math.PI/180);
    for (let i = 657; i <= 816; i++){
      obj.w[i] = Rota3D.rota(obj.w[i]);
    }
    cv.setObj(obj);
    cv.paint();
    pza1DerFunc()

}

//movimiento de piezas
document.getElementById('izquierda').addEventListener('click', pza1IzqFunc, false);
document.getElementById('cerrar').addEventListener('click', pza1IzqFunc2, false);

let Pix: number, Piy: number;
let Pfx: number, Pfy: number;
let theta = 0.3, phi = 1.3, SensibilidadX = 0.02, SensibilidadY = 0.02;
let flag: boolean = false;

function handleMouse(evento: any) {
  Pix=evento.offsetX;
  Piy = evento.offsetY;
  flag = true;
}

function makeVizualization(evento: any) {
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