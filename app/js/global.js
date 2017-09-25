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
            lineHeight = ( fontSize * 0.9 ) + 'px',
            textHeight,
            textWidth;

        do {
            span.css( { fontSize, lineHeight } );
            span2.css( { fontSize, lineHeight } );

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
                c.toBlob( function( blob ) {
                    saveAs( blob, "meme.png" );
                } );
            }
        } );
    } );
} );