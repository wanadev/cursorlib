# CursorLib: generates cursors from canvas

CursorLib generates cursors that works on any browser (Firefox, MSIE,
Chrome,...) from canvas.


## Getting a CSS cursor compatible with the current browser

```javascript
var cursor = cursorLib.canvasToCssCursorProperty(
    canvas,     // The canvas where is drawn the cursor (128px × 128px maximum).
    hotspotX,   // Horizontal coordinates of the hotspot (optional, default=0).
    hotspotY,   // Vertical coordinates of the hotspot (optional, default=0).
    alternative // Alternative cursor if the image is not supported (optional, default="default").
);

document.getElementById("my-element").style.cursor = cursor;
```


## Generating a Microsoft cursor Blob

__NOTE:__ This is only useful if you want to export cursors for Windows/MSIE.
CursorLib generates automatically the right cursor format for the current browser
when you call the `cursorLib.canvasToCssCursorProperty` function.

```javascript
var msCursorBlob = cursorLib.canvasToMsCursor(
    canvas,     // The canvas where is drawn the cursor (256px × 256px maximum).
    hotspotX,   // Horizontal coordinates of the hotspot (optional, default=0).
    hotspotY    // Vertical coordinates of the hotspot (optional, default=0).
);
```


## Changelog

* **1.0.1:** Detect Edge to generate a MS cursor for it (#10)
* **1.0.0:** Initial release


## License

    Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright notice, this
        list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright notice,
        this list of conditions and the following disclaimer in the documentation
        and/or other materials provided with the distribution.
      * Neither Wanadev nor the names of its contributors may be used
        to endorse or promote products derived from this software without specific
        prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


## Authors

* Fabien LOISON <http://www.flozz.fr/>
