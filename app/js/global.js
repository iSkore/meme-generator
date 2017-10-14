'use strict';

import 'bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import MemeCanvas from './MemeCanvas';

// (function( $ ) {
//     $.fn.textfill = function( event, text ) {
//         const
//             maxFontPixels = 48,
//             span          = $( 'span:visible:first', this ),
//             span2         = $( 'span:visible:last', this ),
//             maxHeight     = $( this ).outerHeight(),
//             maxWidth      = $( this ).width();
//
//         span.text( text );
//         span2.text( text );
//
//         if ( maxHeight === 100 && event.which !== 8 ) {
//             event.preventDefault();
//         }
//
//         let
//             fontSize   = maxFontPixels,
//             lineHeight = ( fontSize * 0.9 ) + 'px',
//             textHeight = span.height(),
//             textWidth  = span.width();
//
//         span.css( { fontSize, lineHeight } );
//         span2.css( { fontSize, lineHeight } );
//
//         // do {
//         //     span.css( { fontSize, lineHeight } );
//         //     span2.css( { fontSize, lineHeight } );
//         //
//         //     textHeight = span.height();
//         //     textWidth = span.width();
//         //     fontSize = fontSize - 1;
//         // } while( ( textHeight > maxHeight || textWidth > maxWidth ) && fontSize > 30 );
//
//         if ( textWidth >= maxWidth ) {
//             $( this ).css( { height : '100px' } );
//         }
//
//         return this;
//     };
// })( jQuery );
//
// (function( $ ) {
//     $.fn.textFill = function( context, text = '', x, y ) {
//         let words    = text.split( ' ' ),
//             line     = '',
//             maxWidth = $( '#meme-canvas' ).outerWidth();
//
//         context.font      = '48px FrontFont';
//         context.fillStyle = 'white';
//         context.strokeStyle = 'black';
//         context.lineWidth = 2;
//
//         for ( let n = 0; n < words.length; n++ ) {
//             let testLine  = line + words[ n ] + ' ',
//                 testWidth = context.measureText( testLine ).width;
//
//             if ( testWidth > maxWidth && n > 0 ) {
//                 context.fillText( line, x, y );
//                 context.strokeText( line, x, y );
//                 line = words[ n ] + ' ';
//
//                 if ( y < 80 )
//                     y += 48 * 0.9;
//
//                 // if ( y < )
//             }
//             else if ( testWidth > maxWidth && n === 0 ) {
//                 let prevText = text.substr( 0, text.length - 1 );
//                 return Promise.reject( prevText );
//             }
//             else {
//                 line = testLine;
//             }
//         }
//
//         context.fillText( line, x, y );
//         context.strokeText( line, x, y );
//
//         context.fill();
//         context.stroke();
//
//         return this;
//     };
// })( jQuery );

$( document ).ready( function() {
    const
        top    = $( '#topfont-container' ).children( '.font-wrapper' ),
        bottom = $( '#bottomfont-container' ).children( '.font-wrapper' ),
        meme   = new MemeCanvas(),
        input  = {};

    meme.drawImage( 'assets/memes/Baby-Sammy.png' );

    $( '#topinput' ).bind( 'input', function() {
        input.top = this.value.toUpperCase();
        meme.updateText( this.value, 'top' )
            .catch( prevText => {
                this.value = prevText;
            } )
    } );

    $( '#bottominput' ).bind( 'input', function() {
        input.bottom = this.value.toUpperCase();
        meme.updateText( this.value, 'bottom' )
            .catch( prevText => {

            } );
    } );

    $( '#generate' ).click( () => {
        const
            canvas = document.getElementById( 'meme-container' ),
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