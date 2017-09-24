'use strict';

import 'bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

(function( $ ) {
    $.fn.textfill = function( options ) {
        const
            span      = $( 'span:visible:first', this ),
            maxHeight = $( this ).height(),
            maxWidth  = $( this ).width();

        span.text( options.text );

        let
            fontSize = options.maxFontPixels || 48,
            textHeight,
            textWidth;

        do {
            span.css( {
                'font-size': fontSize,
                'line-height': ( fontSize * 0.9 ) + 'px'
            } );

            textHeight = span.height();
            textWidth = span.width();
            fontSize = fontSize - 1;
        } while( ( textHeight > maxHeight || textWidth > maxWidth ) && fontSize > 10 );

        return this;
    }
})( jQuery );

function drawImageScaled( img, ctx ) {
    return new Promise(
        res => {
            const
                canvas = ctx.canvas,
                hRatio = canvas.width / img.width,
                vRatio = canvas.height / img.height,
                ratio  = Math.min( hRatio, vRatio ),
                shiftX = ( canvas.width - img.width * ratio ) / 2,
                shiftY = ( canvas.height - img.height * ratio ) / 2;

            console.log( shiftX, shiftY );

            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( img, 0, 0, img.width, img.height, shiftX, shiftY, img.width * ratio, img.height * ratio );
            res( {
                x: shiftX,
                y: shiftY,
                width: img.width,
                height: img.height
            } );
        }
    )
}

function loadImage( canvas, src, fn ) {
    const img = new Image();
    img.src = src || '../assets/memes/Baby-Sammy.png';

    img.onload = () => {
        drawImageScaled( img, canvas )
            .then( fn )
            .catch( console.error );
    };
}

function loadText( ctx, txt, position ) {
    console.log( position );
    ctx.strokeText( txt, position.x, position.y, position.width, position.height );
    ctx.fillText( txt, position.x, position.y, position.width, position.height );
}

$( document ).ready( function() {
    const
        canvas      = document.getElementById( 'meme' ),
        ctx         = canvas.getContext( '2d' ),
        topPosition = {
            x: canvas.width * 0.2,
            y: canvas.height * 0.1
        };

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.font = '48px Impact';

    loadImage( ctx, '../assets/memes/Baby-Sammy.png', rect => {
        topPosition.x = rect.x;
        topPosition.y = rect.y;
        topPosition.width = rect.width;
        topPosition.height = rect.height * 0.25;
    } );

    $( '#topinput' ).bind( 'input propertychange', function() {
        loadText( ctx, this.value.toUpperCase(), topPosition );
    } );

    $( '#bottominput' ).bind( 'input propertychange', function() {
    } );

    $( '#generate' ).click( () => {
        const
            canvas = document.getElementById( 'meme' );

        html2canvas( canvas, {
            onrendered: function( c ) {
                const ctx = c.getContext( '2d' );

                c.toBlob( function( blob ) {
                    saveAs( blob, "pretty image.png" );
                } );
            }
        } );
    } );
} );