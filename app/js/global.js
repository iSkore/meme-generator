'use strict';

import 'bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

(function( $ ) {
    $.fn.textfill = function( options ) {
        const
            span      = $( 'span:visible:first', this ),
            span2     = $( 'span:visible:last', this ),
            maxHeight = $( this ).height(),
            maxWidth  = $( this ).width();

        span.text( options.text );
        span2.text( options.text );

        let
            fontSize = options.maxFontPixels || 48,
            textHeight,
            textWidth;

        do {
            span.css( {
                'font-size': fontSize - 4,
                'line-height': ( fontSize * 0.9 ) + 'px',
                'letter-spacing': 2
            } );

            span2.css( {
                'font-size': fontSize + 1,
                'line-height': ( fontSize * 0.9 ) + 'px'
            } );

            textHeight = span.height();
            textWidth = span.width();
            fontSize = fontSize - 1;
        } while( ( textHeight > maxHeight || textWidth > maxWidth ) && fontSize > 10 );

        return this;
    }
})( jQuery );

$( document ).ready( function() {
    const
        top    = $( '#topfont' ),
        bottom = $( '#bottomfont' );

    $( '#topinput' ).bind( 'input propertychange', function() {
        top.textfill( {
            maxFontPixels: 48,
            text: this.value.toUpperCase()
        } );
    } );

    $( '#bottominput' ).bind( 'input propertychange', function() {
        bottom.textfill( {
            maxFontPixels: 48,
            text: this.value.toUpperCase()
        } );
    } );

    $( '#generate' ).click( () => {
        const
            canvas = document.getElementById( 'meme' ),
            render = $( '#render' );

        html2canvas( canvas, {
            letterRendering: true,
            logging: true,
            onrendered: function( c ) {
                console.log( c );
                const ctx = c.getContext( '2d' );
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;

                console.log( ctx );

                render.html( '' );
                render.append( c );

                $( '.mlg' ).modal( 'show' );

                // c.toBlob( function( blob ) {
                // saveAs( blob, "pretty image.png" );
                // } );
            }
        } );
    } );
} );