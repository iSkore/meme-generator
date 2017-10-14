'use strict';

import 'bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

(function( $ ) {
    $.fn.textfill = function( event, text ) {
        const
            maxFontPixels = 48,
            span          = $( 'span:visible:first', this ),
            span2         = $( 'span:visible:last', this ),
            maxHeight     = $( this ).outerHeight(),
            maxWidth      = $( this ).width();

        span.text( text );
        span2.text( text );

        if ( maxHeight === 100 && event.which !== 8 ) {
            event.preventDefault();
        }

        let
            fontSize   = maxFontPixels,
            lineHeight = ( fontSize * 0.9 ) + 'px',
            textWidth  = span.width();

        span.css( { fontSize, lineHeight } );
        span2.css( { fontSize, lineHeight } );

        // do {
        //     span.css( { fontSize, lineHeight } );
        //     span2.css( { fontSize, lineHeight } );
        //
        //     textHeight = span.height();
        //     textWidth = span.width();
        //     fontSize = fontSize - 1;
        // } while( ( textHeight > maxHeight || textWidth > maxWidth ) && fontSize > 30 );

        if ( textWidth >= maxWidth ) {
            $( this ).css( { height : '100px' } );
        }

        return this;
    };
})( jQuery );

$( document ).ready( function() {
    const
        top    = $( '#topfont-container' ).children( '.font-wrapper' ),
        bottom = $( '#bottomfont-container' ).children( '.font-wrapper' );

    $( '#topinput' ).bind( 'input keydown', function( e ) {
        if ( e.which && e.which === 8 )
            return true;

        top.textfill( e, this.value.toUpperCase() );
    } );

    $( '#bottominput' ).bind( 'input keydown', function( e ) {
        if ( e.which && e.which === 8 )
            return true;

        bottom.textfill( e, this.value.toUpperCase() );
    } );

    $( '#generate' ).click( () => {
        const
            canvas = document.getElementById( 'meme' ),
            render = $( '#render' );

        html2canvas( canvas, {
            letterRendering : true,
            logging : true,
            onrendered : function( c ) {
                c.toBlob( function( blob ) {
                    saveAs( blob, 'meme.png' );
                } );
            }
        } );
    } );
} );