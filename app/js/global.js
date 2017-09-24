'use strict';

import 'bootstrap';
import html2canvas from 'html2canvas';

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
            canvas = document.getElementById( 'meme' );

        html2canvas( canvas, {
            onrendered: function( c ) {
                const
                    img = c.toDataURL( 'image/png' );
                window.open( img );
            }
        } );
    } );
} );