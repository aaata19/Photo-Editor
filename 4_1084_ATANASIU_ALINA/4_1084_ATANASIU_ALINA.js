// drag and drop
function allowDrop(event) {
    event.preventDefault();
    document.getElementById('drop-area').style.border = '2px dashed #aaa';
}

function drop(event) {
    event.preventDefault();
    document.getElementById('drop-area').style.border = '2px dashed #ccc';

    const files = event.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect() {
    const files = document.getElementById('file-input').files;
    handleFiles(files);
}

function handleFiles(files) {
    const file = files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const canvas = document.getElementById('image-canvas');
                const ctx = canvas.getContext('2d');

                // raportul de aspect al imaginii
                const aspectRatio = img.width / img.height;

                // Setează dimensiunile canvas-ului
                canvas.width = 500;
                canvas.height = canvas.width / aspectRatio;

                // Redimensionează imaginea proporțional pe canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        };

        reader.readAsDataURL(file);
    } else {
        alert('Te rog să încarci o imagine validă.');
    }
}

// descarcare imagine
function downloadImage() {
    const canvas = document.getElementById('image-canvas');
    const dataURL = canvas.toDataURL();

    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'imagine.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
// adaugare text
function addText(){
    let canvas, context;
    canvas = document.getElementById("image-canvas");
    context = canvas.getContext("2d");

    var text = 'insert Text', pozx = 0, pozy = 0, culoare, dimensiune = 10;

    text = document.querySelector('#text').value;
    pozx = parseInt(document.getElementById('xpozitie').value, 10);
    pozy = parseInt(document.getElementById('ypozitie').value, 10);
    culoare = document.querySelector('#culoare').value;
    dimensiune = parseInt(document.querySelector('#dimensiune').value, 10);

    context.font = `${dimensiune}px Arial`;
    context.fillStyle = culoare;

    context.fillText(text, pozx, pozy);
}
// scalare imag
function scalareImg(width){
    let canvas, context;
    let hnou, wnou;

    canvas = document.getElementById("image-canvas");
    context = canvas.getContext("2d");

    hnou = parseInt(document.getElementById('inaltime').value, 10);
    wnou = parseInt(document.getElementById('latime').value, 10);

    if(isNaN(hnou) && isNaN(wnou)){
        alert('Introdu o valoare pentru inaltime sau latime');
        return;
    }

    if(!isNaN(hnou) && !isNaN(wnou)){
        alert('Pentru a putea pastra proportiile initiale trebuie doar inaltimea sau latimea noua');
        return;
    }

    if(!isNaN(hnou) && hnou <= 0){
        alert('Inaltimea trebuie sa fie mai mare decat 0');
        return;
    }    

    if(!isNaN(wnou) && wnou <= 0){
        alert('Latimea trebuie sa fie mai mare decat 0');
        return;
    }    

    let imagine = new Image();
    imagine.src = document.getElementById('image-canvas').toDataURL();
    
    imagine.onload = function(){
        if(!isNaN(hnou)){
            canvas.height = hnou;
            canvas.width = hnou * (imagine.width / imagine.height);
        }else{
            canvas.width = wnou;
            canvas.height = wnou / (imagine.width / imagine.height);
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imagine, 0, 0, canvas.width, canvas.height);
    }
}

//selecteaza imagine
let isMouseDown = false;
let startX, startY;
let endX, endY;
let selectionWidth, selectionHeight, selectionX, selectionY;

let isShiftPressed = false;


function updateSelectionBox() {
    let selectionBox = document.getElementById('selection-box');
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';
    selectionBox.style.width = endX - startX + 'px';
    selectionBox.style.height = endY - startY + 'px';

    // salvez dimensiune si pozitie selectie
    selectionWidth = endX - startX;
    selectionHeight = endY - startY;
    selectionX = startX;
    selectionY = startY;
}

function handleMouseDown(event) {
    isMouseDown = true;
    const rect = imageContainer.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
    endX = startX;
    endY = startY;
    updateSelectionBox();
}


function handleMouseMove(event) {
    if (isMouseDown) {
        endX = event.clientX;
        endY = event.clientY;
        
        if (isShiftPressed) {
            startX = event.clientX - imageContainer.getBoundingClientRect().left - selectionWidth / 2;
            startY = event.clientY - imageContainer.getBoundingClientRect().top - selectionHeight / 2;
            endX = startX + selectionWidth;
            endY = startY + selectionHeight;
        }
        
        updateSelectionBox();
    }
}

function handleMouseUp() {
    isMouseDown = false;
}

function verificaSelectie(){
   if(selectionWidth > 0 && selectionHeight > 0){
    return true;
   }
   else{
    alert('Nu există nicio selecție.');
    return false;
   }
}

//sterge selectia ->pixeli albi
function stergeSelectia() {
    const canvas = document.getElementById('image-canvas');
    const context = canvas.getContext('2d');

    if (verificaSelectie()) {
        // Șterge pixelii din selecție făcându-i albi
        context.fillStyle = 'white';
        context.fillRect(selectionX, selectionY, selectionWidth, selectionHeight, 0 ,0);

        selectionReset();
    }
}

function selectionReset(){
           // Resetează variabilele de selecție
           selectionWidth = 0;
           selectionHeight = 0;
           selectionX = 0;
           selectionY = 0;
   
           // Șterge și vizualizarea dreptunghiului de selecție
           const selectionBox = document.getElementById('selection-box');
           selectionBox.style.width = '0px';
           selectionBox.style.height = '0px';
}

//crop imagine
function cropImagine(){
    const canvas = document.getElementById('image-canvas');
    const context = canvas.getContext("2d");
    if(verificaSelectie){
        // redimensionare canvas si imagine
        let imagine = new Image();
        imagine.src = document.getElementById('image-canvas').toDataURL();

        imagine.onload = function(){
            context.clearRect(0,0,canvas.width, canvas.height);
            context.drawImage(imagine, selectionX, selectionY, selectionWidth, selectionHeight, 0 ,0, selectionWidth, selectionHeight);
        }

    }
}

const imageContainer = document.getElementById('image-container');
imageContainer.addEventListener('mousedown', handleMouseDown);
imageContainer.addEventListener('mousemove', handleMouseMove);
imageContainer.addEventListener('mouseup', handleMouseUp);

// shift
document.addEventListener('keydown', function(event) {
    if (event.key === 'Shift') {
        isShiftPressed = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'Shift') {
        isShiftPressed = false;
    }
});
