class Glasses {
    async getGlasses() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', `https://optimaxdev.github.io/volga-it/response.json`)
            xhr.responseType = 'json'
            xhr.onload = () => {
                if (xhr.status >= 400) {
                    reject(xhr.response)
                } else {
                    resolve(xhr.response)
                }
            }
            xhr.onerror = () => {
                reject(xhr.response)
            }
            xhr.send()
        })

    }
}

class UI {
    constructor() {
        this.widgetID = document.getElementById('virtual-mirror-widget');
    }

    paintMainWidget(data) {
        this.widgetID.innerHTML = `
            <div id="JeelizVTOWidget" class="v-mirror__wrap">
                <div class="v-mirror__content">
                    <div id="JeelizVTOWidgetCanvas" class="draggable v-mirror__image-wrap">
                        <div class="file-upload">
                            <label>
                                <div class="file-upload__icon"></div>
                                <input id="uploadImg" type="file" name="uploadImg">
                                <span class="uploadImg__fileName">Take a photo</span>
                            </label>
                        </div>
                        <img class="v-mirror__img" src="../images/img.png" alt="">
                    </div>
                    <div class="v-mirror__info">
                        <div class="v-mirror__title">${data.items[0].name}</div>
                        <div class="v-mirror__glasses-img-wrap"><img class="v-mirror__glasses-img"
                                                                 src="${data.items[0]['image']}" alt=""></div>
                        <button class="v-mirror__btn">Choose Lenses</button>
                        <div class="v-mirror__title">Product Description</div>
                        <div class="v-mirror__desc">${data.items[0]['description']}</div>
                    </div>
                    <div class="glasses">
                        <div class="glasses__subtitle">Similar Frames</div>
                        <div class="glasses__list">
                            <div class="glasses__item"><img class="glasses__img" src="${data.items[1]['image']}" alt="#">
                                <div class="glasses__title">${data.items[1].name}</div>
                            </div>
                            <div class="glasses__item"><img class="glasses__img" src="${data.items[2]['image']}" alt="#">
                                <div class="glasses__title">${data.items[2].name}</div>
                            </div>
                            <div class="glasses__item"><img class="glasses__img" src="${data.items[3]['image']}" alt="#">
                                <div class="glasses__title">${data.items[3].name}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="height: 40px; width: 50px; position:relative;"></div>
            </div>
        `
        let chooseBtn = document.querySelector('.v-mirror__btn')
        chooseBtn.addEventListener('click', () => {
            const srcMainImg = document.querySelector('.v-mirror__img').src
            this.paintDetailsWidget(data, srcMainImg)
        })
        uploadFile('#uploadImg');

    }


    paintDetailsWidget(data, src) {
        this.widgetID.innerHTML = `
            <div id="JeelizVTOWidget" class="v-mirror__wrap">
                <div class="v-mirror__content">
                    <div id="JeelizVTOWidgetCanvas" class="draggable v-mirror__image-wrap">
                        <div class="file-upload">
                            <label>
                                <div class="file-upload__icon"></div>
                                <input id="uploadImg" type="file" name="uploadImg">
                                <span class="uploadImg__fileName">Retake</span>
                            </label>
                        </div>
                        <img class="v-mirror__img" src="${src}" alt="">
                        <div id="leftDraggable" class="imageAdjuster__draggableTrigger___1wplT" style="left: 195px; top: 187px;"></div>
                        <div id="rightDraggable" class="imageAdjuster__draggableTrigger___1wplT" style="left: 267px; top: 188px;"></div>
                    </div>
                    <div class="v-mirror-details__info">
                        <div class="v-mirror-details__back">< Back</div>
                        <div class="v-mirror__title">Adjust the Image</div>
                        <div class="v-mirror-details__list">
                            <div class="v-mirror-details__item">1. Drag the RED targets to the center of your eyes.</div>
                            <div class="v-mirror-details__item">2. Drag to reposition photo</div>
                            <div class="v-mirror-details__item">3. Set your PD, if you know it.
                                <input class="v-mirror-details__input" type="text" value="62">
                            </div>
                            <div class="v-mirror-details__item">4. Adjust the photo with the controls.</div>
                        </div>
                    </div>
                    <div class="controls__wrap">
                        <button class="controls__btn">Try On Glasses</button>
                    </div>
                </div>
            </div>
        `
        let leftDraggable = document.querySelector('#leftDraggable');
        let rightDraggable = document.querySelector('#rightDraggable');

        uploadFile('#uploadImg')
        dragAndDrop(leftDraggable);
        dragAndDrop(rightDraggable);

        let tryGlasses = document.querySelector('.controls__btn')
        tryGlasses.addEventListener('click', () => {
            let pd = document.querySelector('.v-mirror-details__input').value
            let x1 = parseFloat(leftDraggable.style.left) + parseFloat(leftDraggable.offsetWidth) / 2;
            let y1 = parseFloat(leftDraggable.style.top) + parseFloat(leftDraggable.offsetHeight) / 2;
            let x2 = parseFloat(rightDraggable.style.left) + parseFloat(rightDraggable.offsetWidth) / 2;
            let y2 = parseFloat(rightDraggable.style.top) + parseFloat(rightDraggable.offsetHeight) / 2;
            this.paintMainWidget(data)
            this.putGlasses('../images/7134.png')
            this.posGlasses(135, pd, x1, y1, x2, y2)
        })
    }

    putGlasses(src) {
        const glassesImg = document.getElementById('v-mirror__glasses-img');
        if (glassesImg) {
            glassesImg.src = src
            return
        }

        let container = document.querySelector('.v-mirror__image-wrap')
        let imgEl = document.createElement('img')
        imgEl.id = 'v-mirror__glasses-img';
        imgEl.src = src
        imgEl.style.position = 'absolute'
        container.appendChild(imgEl)
    }

    posGlasses(frameWidth, pd, x1, y1, x2, y2) {
        const glass = document.getElementById('v-mirror__glasses-img');
        glass.onload = () => {
            const frameImageWidth = glass.offsetWidth;
            const distanceBetweenPupilMarks = Math.abs(x1 - x2)
            const frameScaleRatio = frameImageWidth * ((frameWidth / frameImageWidth) / (pd / distanceBetweenPupilMarks))
            glass.style.width = frameScaleRatio + 'px'
            glass.style.left = x1 + distanceBetweenPupilMarks / 2 - frameScaleRatio / 2 + 'px';
            glass.style.top = y1 - glass.height / 2 + 'px';
            glass.style.transform = `rotate(${getAngle(x1, y1, x2, y2)}deg)`
            console.log(getAngle(x1, y1, x2, y2))
        }
        function getAngle(x1, y1, x2, y2) {
            let angle = parseFloat(Math.atan2(y1 - y2, x1 - x2)) * (180 / Math.PI) - 180;

            if(angle < 0){
                angle += 360;
            }
            return angle;
        }
    }

}

function uploadFile(className) {
    document.querySelector(className).addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const img = document.querySelector('.v-mirror__img');
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            }

            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
    });
}


const ui = new UI();
const glasses = new Glasses();


document.addEventListener("DOMContentLoaded", getWeather);

function getWeather() {
    glasses
        .getGlasses()
        .then((data) => {
            ui.paintMainWidget(data);
        })
        .catch((err) => alert(err.message));
}

function dragAndDrop(dragger) {
    if (dragger === null)
        return

    dragger.onmousedown = function (event) {
        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            dragger.style.left = pageX - dragger.offsetWidth / 2 + 'px';
            dragger.style.top = pageY - dragger.offsetHeight / 2 + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);

        dragger.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            dragger.onmouseup = null;
        };
        dragger.ondragstart = function () {
            return false;
        };


    };
}