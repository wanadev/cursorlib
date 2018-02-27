(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cursorLib = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */


/*
 * From: https://github.com/ebidel/filer.js/blob/4e71a2e08ddc80223714b159bfd22958066380be/src/filer.js#L131
 *
 * Copyright 2013 - Eric Bidelman
 * License: Apache 2.0 <https://github.com/ebidel/filer.js/blob/master/LICENSE>
 */
function _dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}

function _toLittleEndian(number, size) {
    var result = new Uint8Array(size);
    for (var i=0 ; i<size ; i++) {
        result[i] = number >> i*8 & 0xFF;
    }
    return result;
}

// Spec: http://en.wikipedia.org/wiki/ICO_%28file_format%29
function canvasToMsCursor(canvas, hotspotX, hotspotY) {
    var hotspotX = hotspotX|0;
    var hotspotY = hotspotY|0;

    if (canvas.width > 256 || canvas.height > 256 || canvas.width == 0 || canvas.height == 0) {
        throw "Invalid canvas size";
    }

    if (hotspotX > 255 || hotspotY > 255) {
        throw "Invalid hotspot";
    }

    var image = _dataURLToBlob(canvas.toDataURL("png"));

    var windowsIconHeader = {
        reserved: _toLittleEndian(0, 2),  // Reserved
        type: _toLittleEndian(2, 2),      // Image type: (1 = ico, 2 = cur)
        count: _toLittleEndian(1, 2)      // Number of images in the file
    };

    var iconEntry = {
        width: _toLittleEndian(canvas.width % 256, 1),    // Image width
        height: _toLittleEndian(canvas.height % 256, 1),  // Image height
        colorCount: _toLittleEndian(0, 1),                // Number of colors in the color palette (0 = no palette)
        reserved: _toLittleEndian(0, 1),                  // Reserved
        hotspotX: _toLittleEndian(hotspotX, 2),           // Horizontal coordinates of the hotspot
        hotspotY: _toLittleEndian(hotspotY, 2),           // Vertical coordinates of the hotspot
        bytesInRes: _toLittleEndian(image.size, 4),       // Size of the image's data in bytes
        imageOffset: _toLittleEndian(22, 4)               // The offset of BMP or PNG data from the beginning of the ICO/CUR file
    };

    return new Blob([
            windowsIconHeader.reserved,
            windowsIconHeader.type,
            windowsIconHeader.count,
            iconEntry.width,
            iconEntry.height,
            iconEntry.colorCount,
            iconEntry.reserved,
            iconEntry.hotspotX,
            iconEntry.hotspotY,
            iconEntry.bytesInRes,
            iconEntry.imageOffset,
            image
    ], {type: "image/x-icon"});
}

function canvasToCssCursorProperty(canvas, hotspotX, hotspotY, alternative) {
    var hotspotX = hotspotX|0;
    var hotspotY = hotspotY|0;
    var alternative = alternative || "default";

    if (canvas.width > 128 || canvas.height > 128 || canvas.width == 0 || canvas.height == 0) {
        throw "Invalid canvas size";
    }

    if (hotspotX > 127 || hotspotY > 127) {
        throw "Invalid hotspot";
    }

    // MSIE
    if (window.ActiveXObject || /Edge/.test(navigator.userAgent)) {
        var blob = canvasToMsCursor(canvas, hotspotX, hotspotY);
        var url = URL.createObjectURL(blob);
        return "".concat("url(", url, "), ", alternative);
    }
    // Any other browser
    else {
        var blob = _dataURLToBlob(canvas.toDataURL("png"));
        var url = URL.createObjectURL(blob);
        return "".concat("url(", url, ") ", hotspotX, " ", hotspotY, ", ", alternative);
    }
}

module.exports = {
    canvasToMsCursor: canvasToMsCursor,
    canvasToCssCursorProperty: canvasToCssCursorProperty
};

},{}]},{},[1])(1)
});