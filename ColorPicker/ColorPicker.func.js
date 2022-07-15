/**
 * @author Eddy Ntambwe<eddydarell@gmail.com>
 * @created 2016-01-10
 * 
 * Detailed Information
 * ====================
 * 
 * Creates an instance of a color picker with fixed size.
 * Declare the Color Picker like this:
 *      1)cp = new ColorPicker;
 *      2)cp.setColor('ffffff');
 *      3)cp.render();
 * Always set the color before rendering.
 * 
 * @returns {ColorPicker}   an instance of the color picker
 */
class ColorPicker {
    constructor() {
        let instance = this;

        instance.width = 199;
        instance.height = 199;
        instance.palette = document.createElement('div');
        instance.hueBar = document.createElement('div');
        instance.satBar = document.createElement('div');
        instance.valBar = document.createElement('div');
        instance.hueBarBG = document.createElement('img');
        instance.gradient = document.createElement('img');
        instance.colorHex = document.createElement('span');
        instance.colorDetails = document.createElement('div');
        instance.colorCode = document.createElement('span');
        instance.colPreview = document.createElement('span');
        instance.hueCursor = document.createElement('span'); //Cursor on the hue bar
        instance.paletteCursor = document.createElement('span'); //Palette pointer
        instance.r = document.createElement('span');
        instance.g = document.createElement('span');
        instance.b = document.createElement('span');
        instance.box = null; //Main container
        instance.hueCursor.position = null;
        instance.paletteCursor.position = null;
        instance.onChange = null;

        instance.defaultColor = '000000';
        instance.previewColor = '#' + instance.defaultColor; ////If no color has been set, set the default
        instance.baseColor = instance.getBaseColor(instance.previewColor); //Set the base color color if specified    

        return instance;
    }
    
    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed Information
     * ====================
     *
     * Sets a given color to the color picker components and updates the color picker
     *
     * @param {string} color    The color in the hex format without the '#'
     */
    setColor(color) {
        let instance = this;

        if (typeof color != 'string' || color.length != 6) return;

        instance.previewColor = '#' + color;
        instance.baseColor = instance.getBaseColor(instance.previewColor); //gets the color of the palette background
        instance.updatePalette(true);
        instance.updateColor(true); //Update the colorpicker

        if (instance.onChange != null) instance.onChange();

        //Position of the palette cursor
        instance.paletteCursor.style.left = instance.updateCursorPosition(true, instance.previewColor)[0] + 'px';
        instance.paletteCursor.style.top = instance.updateCursorPosition(true, instance.previewColor)[1] + 'px';

        //position of hue bar cursor
        instance.hueCursor.style.top = instance.updateCursorPosition(false, instance.previewColor)[1] + 'px';
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-10
     *
     * @returns {String} instance.previewColor  the preview color in hex format without '#'
     */
    getColor() {
        let instance = this;
        let color;

        if (instance.previewColor.length == 7)
            color = instance.previewColor.substring(1, 7);
        else if (instance.previewColor.length == 6)
            color = instance.previewColor;
        else {
            let rgb = instance.previewColor.replace(/[^\d,]/g, '').split(',');
            color = instance.intToHex(rgb[0]) + instance.intToHex(rgb[1]) + instance.intToHex(rgb[2]);
        }

        return color;
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-19
     *
     * @param {function}    callb   the callback function
     */
    setOnChange(callb) {
        let instance = this;
        instance.onChange = callb;
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-10
     *
     * Detailed Information
     * ====================
     *
     * Draws the color picker
     *
     * @returns {DOM element} instance.box  the color picker box
     */
    render() {
        let instance = this;
        instance.box = document.createElement('div');

        instance.box.className = 'color-picker';
        instance.palette.className = 'palette';
        instance.gradient.className = 'gradient';

        instance.gradient.src = 'assets/mask.png';
        instance.hueBarBG.src = 'assets/huebar.png';

        instance.hueBar.className = 'hue-bar';
        instance.satBar.className = 'sat-bar';
        instance.valBar.className = 'val-bar';
        instance.hueBarBG.className = 'hue-bar-img';
        instance.hueCursor.className = 'hue-cursor';
        instance.paletteCursor.className = 'palette-cursor';
        instance.colorDetails.className = 'color-details';
        instance.colorHex.className = 'color-hex';
        instance.colorCode.className = 'color-code';
        instance.colPreview.className = 'color-preview-box';
        instance.r.className = 'rgb r';
        instance.g.className = 'rgb g';
        instance.b.className = 'rgb b';

        //Create the hue bar
        instance.hueBar.appendChild(instance.hueBarBG);
        instance.hueBar.appendChild(instance.hueCursor);

        //Append elements
        instance.palette.appendChild(instance.gradient);
        instance.palette.appendChild(instance.paletteCursor);
        instance.colorDetails.appendChild(instance.colPreview);
        instance.colorDetails.appendChild(instance.r);
        instance.colorDetails.appendChild(instance.g);
        instance.colorDetails.appendChild(instance.b);
        instance.box.appendChild(instance.palette);
        instance.box.appendChild(instance.hueBar);
        instance.box.appendChild(instance.satBar);
        instance.box.appendChild(instance.valBar);
        instance.box.appendChild(instance.colorDetails);
        instance.box.appendChild(instance.colorHex);

        //set values
        instance.palette.style.backgroundColor = instance.baseColor;
        instance.updateColor(true);

        //enable the eventhandlers
        instance.addHandler(instance.hueBar);
        instance.addHandler(instance.valBar);
        instance.addHandler(instance.satBar);
        instance.addHandler(instance.gradient);
        instance.addHandler(instance.paletteCursor);

        //POsition of the palette cursor
        instance.paletteCursor.style.left = instance.updateCursorPosition(true, instance.previewColor)[0] + 'px';
        instance.paletteCursor.style.top = instance.updateCursorPosition(true, instance.previewColor)[1] + 'px';

        //position of hue bar cursor
        instance.hueCursor.style.top = instance.updateCursorPosition(false, instance.previewColor)[1] + 'px';

        return instance.box;
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed Information
     * ====================
     *
     * Updates the palette base color
     *
     * @param {boolean} isColorSet    true if the color is set with setColor()
     * @param {event} e     The event calling the app
     */
    updatePalette(isColorSet, e) {
        let instance = this;

        if (isColorSet == null) isColorSet = false; //Set default value
        if (isColorSet === false) {
            let mouse = instance.getMousePosition(e);
            let outline = instance.getElementOutline(instance.hueBar);
            let top = outline[1];
            let height = outline[2];
            let posY = mouse[1] - top;
            
            if (posY > height) posY = height;
            if (posY < 0) posY = 0;

            let hue = posY * 360 / height;

            if (hue === 360) hue = 359; // Set hue max value to 359 

            let rgb = instance.hsvToRgb(hue, 100, 100); //use max saturation and value

            instance.baseColor = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
            instance.previewColor = instance.baseColor;
            instance.updateColor(true);
            instance.palette.style.backgroundColor = instance.baseColor;
        } else {
            instance.palette.style.backgroundColor = instance.baseColor;
        }
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed Information
     * ====================
     *
     * Updates the shades of any given base color from the position of click or
     * the cursor's position
     *
     * @param (event) e     the event calling the function
     */
    updateShade(e) {
        let instance = this;
        let hsv, rgb;

        if (instance.baseColor.length === 7 || instance.baseColor.length === 6) {
            hsv = instance.rgb2hsv(instance.hexToR(instance.baseColor), instance.hexToG(instance.baseColor), instance.hexToB(instance.baseColor));
        } else {
            rgb = instance.baseColor.replace(/[^\d,]/g, '').split(',');
            hsv = instance.rgb2hsv(rgb[0], rgb[1], rgb[2]);
        }

        let mouse = instance.getMousePosition(e);
        let outline = instance.getElementOutline(instance.palette);
        let left = outline[0];
        let top = outline[1];
        let height = outline[2];
        let width = outline[3];

        let posX = mouse[0] - left;
        let posY = mouse[1] - top;
        let newHSV = [hsv[0], posX * hsv[1] / width, hsv[2] - (posY * hsv[2] / height)];
        let newrgb = instance.hsvToRgb(newHSV[0], newHSV[1] * 100, newHSV[2] * 100); //Times 100 for the function to accept the paramaters

        instance.previewColor = 'rgb(' + newrgb[0] + ',' + newrgb[1] + ',' + newrgb[2] + ')';
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed Information
     * ====================
     *
     * Binds event handlers to the elements
     *
     * @param {object} elem    The DOM oject to which the event handling is bound
     */
    addHandler(elem) {
        let instance = this;

        if (elem == instance.hueBar) {
            let mousedown = false;

            if (elem.addEventListener) { //Tests if IE8
                //Modern browsers
                elem.addEventListener('click', function (evt) {
                    evt.preventDefault();
                    instance.updatePalette(false, evt);
                    instance.updateColor(false, false);
                    instance.moveCursor(instance.hueCursor, instance.hueBar, false, evt);
                    
                    if (instance.onChange != null) instance.onChange();
                });
                elem.addEventListener('mousedown', function (evt) {
                    evt.preventDefault();
                    mousedown = true;
                });
                document.body.addEventListener('mouseup', function (evt) {
                    mousedown = false;
                });
                document.body.addEventListener('mousemove', function (evt) {
                    if (mousedown) {
                        evt.preventDefault();
                        instance.updatePalette(false, evt);
                        instance.updateColor(false, false);
                        instance.moveCursor(instance.hueCursor, instance.hueBar, false, evt);
                        if (instance.onChange != null)
                            instance.onChange();
                    }
                });
            } else {
                //IE8
                elem.attachEvent('onclick', function (evt) {
                    evt.returnValue = false;
                    instance.updatePalette(false, evt);
                    instance.updateColor(false, false);
                    instance.moveCursor(instance.hueCursor, instance.hueBar, false);
                    if (instance.onChange != null)
                        instance.onChange();
                });
                elem.attachEvent('onmousedown', function (evt) {
                    evt.returnValue = false;
                    mousedown = true;
                });
                document.body.attachEvent('onmouseup', function (evt) {
                    mousedown = false;
                });
                document.body.attachEvent('onmousemove', function (evt) {
                    if (mousedown) {
                        evt.returnValue = false;
                        instance.updatePalette(false, evt);
                        instance.updateColor(false, false);
                        instance.moveCursor(instance.hueCursor, instance.hueBar, false);
                        if (instance.onChange != null)
                            instance.onChange();
                    }
                });
            }
        } else { //Palette
            let mousedown = false;

            if (elem.addEventListener){ //Tests if IE8
                //Modern Browsers
                elem.addEventListener('click', function (evt) {
                    evt.preventDefault();
                    instance.updateShade(evt);
                    instance.updateColor(false, true);
                    instance.moveCursor(instance.paletteCursor, instance.palette, true, evt);
                    if (instance.onChange != null)
                        instance.onChange();
                });
                elem.addEventListener('mousedown', function (evt) {
                    evt.preventDefault();
                    mousedown = true;
                });
                document.body.addEventListener('mouseup', function (evt) {
                    mousedown = false;
                });
                document.body.addEventListener('mousemove', function (evt) {
                    if (mousedown) {
                        evt.preventDefault();
                        instance.updateShade(evt);
                        instance.updateColor(false, true);
                        instance.moveCursor(instance.paletteCursor, instance.palette, true, evt);
                        if (instance.onChange != null)
                            instance.onChange();
                    }
                });
            } else { //IE8
                elem.attachEvent('onclick', function (evt) {
                    evt.returnValue = false;
                    instance.updateShade(evt);
                    instance.updateColor(false, true);
                    instance.moveCursor(instance.paletteCursor, instance.palette, true);
                    if (instance.onChange != null)
                        instance.onChange();
                });
                elem.attachEvent('onmousedown', function (evt) {
                    evt.returnValue = false;
                    mousedown = true;
                });
                document.body.attachEvent('onmouseup', function (evt) {
                    mousedown = false;
                });
                document.body.attachEvent('onmousemove', function (evt) {
                    if (mousedown) {
                        evt.returnValue = false;
                        instance.updateShade(evt);
                        instance.updateColor(false, true);
                        instance.moveCursor(instance.paletteCursor, instance.palette, true);
                        if (instance.onChange != null)
                            instance.onChange();
                    }
                });
            }
        }
    }
    
    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed Information
     * ====================
     *
     * The function updates the color for the preview box and its codes
     * in the code boxes
     *
     * @param {boolean} isInit  True if this is the first rendering of the color picker, function render()
     * @param {boolean} isPalette   True if the color is changed by a mouse mouvement on the palette or the hue bar
     */
    updateColor(isInit, isPalette) {
        let instance = this;
        let rgb;

        if (isInit){ //First render
            rgb = [instance.hexToR(instance.previewColor), instance.hexToG(instance.previewColor), instance.hexToB(instance.previewColor)];

            instance.r.innerHTML = 'R <span class="code-box">' + rgb[0] + '</span>';
            instance.g.innerHTML = 'G <span class="code-box">' + rgb[1] + '</span>';
            instance.b.innerHTML = 'B <span class="code-box">' + rgb[2] + '</span>';
            instance.colorHex.innerHTML = 'Hex <span class="hex-code-box">' + instance.rgbToHex(rgb[0], rgb[1], rgb[2]) + '</span>';
        } else {
            if (isPalette) { //The color is set from the palette
                rgb = instance.previewColor.replace(/[^\d,]/g, '').split(',');

                instance.r.innerHTML = 'R <span class="code-box">' + rgb[0] + '</span>';
                instance.g.innerHTML = 'G <span class="code-box">' + rgb[1] + '</span>';
                instance.b.innerHTML = 'B <span class="code-box">' + rgb[2] + '</span>';
                instance.colorHex.innerHTML = 'Hex <span class="hex-code-box">' + instance.rgbToHex(rgb[0], rgb[1], rgb[2]) + '</span>';
            } else {
                rgb = instance.baseColor.replace(/[^\d,]/g, '').split(',');

                //get cursor position
                let cOutline = instance.getElementOutline(instance.paletteCursor);
                let cLeft = cOutline[0];
                let cTop = cOutline[1];

                //Get palette size
                let pOutline = instance.getElementOutline(instance.palette);
                let height = pOutline[2];
                let width = pOutline[3];
                let pLeft = pOutline[0];
                let pTop = pOutline[1];

                //To get the inner left and top of the cursor
                cLeft = cLeft - pLeft;
                cTop = cTop - pTop;

                if (cLeft === 145) cLeft += 7; //Adjust the max values for left and top 
                if (cTop === 155) cTop += 7;

                let hsv = instance.rgb2hsv(rgb[0], rgb[1], rgb[2]);
                let newHSV = [hsv[0], cLeft * hsv[1] / width, hsv[2] - (cTop * hsv[2] / height)]; //Width includes the margins
                let newRGB = instance.hsvToRgb(hsv[0], newHSV[1] * 100, newHSV[2] * 100);

                instance.r.innerHTML = 'R <span class="code-box">' + newRGB[0] + '</span>';
                instance.g.innerHTML = 'G <span class="code-box">' + newRGB[1] + '</span>';
                instance.b.innerHTML = 'B <span class="code-box">' + newRGB[2] + '</span>';
                instance.colorHex.innerHTML = 'Hex <span class="hex-code-box">' + instance.rgbToHex(newRGB[0], newRGB[1], newRGB[2]) + '</span>';
                instance.previewColor = 'rgb(' + newRGB[0] + ', ' + newRGB[1] + ', ' + newRGB[2] + ')';
            }
        }

        instance.colPreview.style.backgroundColor = instance.previewColor;
        instance.palette.style.backgroundColor = instance.baseColor;
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed information
     * ====================
     *
     * Moves the cursor around following the mouse position onscreen
     * The cursor is bound to the container.
     *
     * @param {object} elem     The selected cursor
     * @param {object} container    THe cursor's container
     * @param {Boolean} hSlide      True if the cursor can move horizontally
     * @param {event} e The event calling the function
     */
    moveCursor(elem, container, hSlide, e) {
        let instance = this;
        //Container's sizes
        let outline = instance.getElementOutline(container);
        let mousePosition = instance.getMousePosition(e);
        let left = outline[0];
        let top = outline[1];
        let height = outline[2];
        let width = outline[3];
        let mouseX = mousePosition[0];
        let mouseY = mousePosition[1];

        if (hSlide) {
            let posLeft = mouseX - left;
            let posTop = mouseY - top;

            if (left > mouseX) posLeft = 0;
            if (mouseX > left + width - 7) posLeft = width - 7;

            elem.style.left = posLeft + 'px';

            if (top > mouseY) posTop = 0;
            if (mouseY > top + height - 7) posTop = height - 7;

            elem.style.top = posTop + 'px';
        } else {
            let posTop = mouseY - top;

            if (top > mouseY) posTop = 0;
            if (mouseY > top + height - 5) posTop = height - 5;

            elem.style.top = posTop + 'px';
        }
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-12
     *
     * Detailed Information
     * ====================
     *
     * Returns the base color of any variant of it (max saturation and value, same hue)
     *
     * @param {string} c    The color in rgb(rr, gg, bb) or hex
     * @returns {String} hex    The hex code of the base color
     */
    getBaseColor(c) {
        let instance = this;
        let hsv, rgb, hex, base;

        if (c.length == 7 || c.length == 6) {
            hsv = instance.rgb2hsv(instance.hexToR(c), instance.hexToG(c), instance.hexToB(c));
            base = instance.hsvToRgb(hsv[0], 100, 100);
            hex = '#' + instance.intToHex(base[0]) + instance.intToHex(base[1]) + instance.intToHex(base[2]);
        } else {
            rgb = c.replace(/[^\d,]/g, '').split(',');
            hsv = instance.rgb2hsv(rgb[0], rgb[1], rgb[2]);
            base = instance.hsvToRgb(hsv[0], 100, 100);
            hex = '#' + instance.intToHex(base[0]) + instance.intToHex(base[1]) + instance.intToHex(base[2]);
        }

        return hex;
    }

    /**
     * @author Eddy Ntambwe<eddydarell@gmail.com>
     * @created 2016-01-11
     *
     * Detailed information
     * ====================
     *
     * Moves the cursor around following the mouse position onscreen
     * The cursor is bound to the container.
     *
     * @param {boolean} cursor     True for the palette, false for the HUe bar
     * @param {string} color    The preview color
     *
     * @return {array}      The positions for the cursor
     */
    updateCursorPosition(cursor, color) {
        let instance = this;
        let rgb, hsv, posX, posY;

        if (color.length == 6 || color.length == 7) { //If hex format
            rgb = [instance.hexToR(color), instance.hexToG(color), instance.hexToB(color)]; //Converts the hexadecimal to R, G and B values
        } else { //If the color is rgb(rrr, ggg, bbb) format
            rgb = color.replace(/[^\d,]/g, '').split(',');
        }

        hsv = instance.rgb2hsv(rgb[0], rgb[1], rgb[2]);

        if (!cursor) { //Huebar cursor
            posY = hsv[0] * instance.height / 360; //162 and 152 values to be replaced with containers height and width
            posX = 0;
        } else { //palette cursor
            posX = instance.width * hsv[1]; //Values of S between 0 and 1
            posY = instance.height - (instance.height * hsv[2]);

            if (posX > instance.width - 7) posX = instance.width - 7;
            if (posY > instance.height - 7) posY = instance.height - 7;
        }

        return [posX, posY];
    }

    /**
    * @author Eddy Ntambwe<eddydarell@gmail.com>
    * @created 2016-01-07
    *
    * Detailed Information
    * ====================
    *
    * Buiulds the Hex color code
    *
    * @param int r  Hex values of R, G and B
    * @param int g
    * @param int b
    *
    * @return string   the color string
    */
    rgbToHex(r, g, b) {
        let instance = this;
        return '#' + instance.intToHex(r) + instance.intToHex(g) + instance.intToHex(b);
    }

    /**
    * @author Eddy Ntambwe<eddydarell@gmail.com>
    * @created 2016-01-07
    *
    * Detailed Information
    * ====================
    *
    * Converts the decimal to hexadecimal
    *
    * @param int n
    *
    * @return string    the hexadecimal string
    *
    */
    intToHex(n) {
        let nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }

    /**
    * @author Eddy Ntambwe<eddydarell@gmail.com>
    * @created 2016-01-08
    *
    * Detailed Information
    * ====================
    *
    * Retrieves the mouse position
    *
    * @param e
    *
    * @return array coordonates    The mouse coordonates
    */
    getMousePosition(event) {
        let e = event || window.event;
        let posX = e.clientX;
        let posY = e.clientY;
        let top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        let left = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;

        return [posX + left, posY + top];
    }

    /**
    * @author Eddy Ntambwe<eddydarell@gmail.com>
    * @created 2016-01-08
    *
    * Detailed Information
    * ====================
    *
    * Retrieves an element outline
    *
    * @param object elem
    *
    * @return array elemPosition
    */
    getElementOutline(elem) {
        let left, top, width, height;

        left = 0;
        top = 0;
        width = parseInt(elem.offsetWidth, 10);
        height = parseInt(elem.offsetHeight, 10);

        while (elem !== null) {
            left = left + parseInt(elem.offsetLeft, 10);
            top = top + parseInt(elem.offsetTop, 10);
            elem = elem.offsetParent;
        }

        return [left, top, height, width];
    }

    /**
    * Detailed Information
    * ====================
    *
    * Converts a color from HSV format to RGB
    * 
    * @param {type} h   THe hue value (0 - 359)
    * @param {type} s   The saturation value (0 - 100)
    * @param {type} v   THe Value value (0 - 100)
    *
    * @returns {Array}  THe R, G and B value as int
    */
    hsvToRgb(h, s, v) {
        let r, g, b;
        let i;
        let f, p, q, t;

        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));
        s /= 100;
        v /= 100;

        if (s == 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;

            case 1:
                r = q;
                g = v;
                b = p;
                break;

            case 2:
                r = p;
                g = v;
                b = t;
                break;

            case 3:
                r = p;
                g = q;
                b = v;
                break;

            case 4:
                r = t;
                g = p;
                b = v;
                break;

            default:
                r = v;
                g = p;
                b = q;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
    * Detailed Information
    * ====================
    *
    * Converts a color from the RGB format to the HSV format
    *
    * @param {int} r   The R value as integer
    * @param {int} g    THe G value as integer
    * @param {int} b    The B value as integer
    *
    * @returns {Array|undefined}    Values of H, S and V (0 - 359, 0 - 1, 0 - 1)
    */
    rgb2hsv(red, green, blue) {
        let newH = 0;
        let newS = 0;
        let newV = 0;

        //remove spaces from input RGB values, convert to int
        let r = parseInt(('' + red).replace(/\s/g, ''), 10);
        let g = parseInt(('' + green).replace(/\s/g, ''), 10);
        let b = parseInt(('' + blue).replace(/\s/g, ''), 10);

        if (r == null || g == null || b == null || isNaN(r) || isNaN(g) || isNaN(b)) {
            return;
        }
        if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
            return;
        }
        r = r / 255;
        g = g / 255;
        b = b / 255;
        let minimumRGB = Math.min(r, Math.min(g, b));
        let maximunRGB = Math.max(r, Math.max(g, b));

        // Black-gray-white
        if (minimumRGB == maximunRGB) {
            newV = minimumRGB;
            return [0, 0, newV];
        }

        // Colors other than black-gray-white:
        let d = (r == minimumRGB) ? g - b : ((b == minimumRGB) ? r - g : b - r);
        let h = (r == minimumRGB) ? 3 : ((b == minimumRGB) ? 1 : 5);
        newH = 60 * (h - d / (maximunRGB - minimumRGB));
        newS = (maximunRGB - minimumRGB) / maximunRGB;
        newV = maximunRGB;
        return [newH, newS, newV];
    }
    //Convertion functions
    hexToR(hex) {
        let instance = this;
        return parseInt((instance.cutHex(hex)).substring(0, 2), 16);
    }
    hexToG(hex) {
        let instance = this;
        return parseInt((instance.cutHex(hex)).substring(2, 4), 16);
    }
    hexToB(hex) {
        let instance = this;
        return parseInt((instance.cutHex(hex)).substring(4, 6), 16);
    }
    cutHex(hex) {
        return (hex.charAt(0) === "#") ? hex.substring(1, 7) : hex;
    }
}  

//instance.height = 199;
//instance.width = 199;