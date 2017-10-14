'use strict';

import 'bootstrap';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import MemeCanvas from './MemeCanvas';

$( document ).ready( function() {
    let meme;

    meme = new MemeCanvas();
    meme.drawImage( 'assets/memes/Black-Girl-Wat.jpg' );

    $( '#topinput' ).bind( 'input', function() {
        meme.updateText( this.value, 'top' )
            .catch( prevText => {
                this.value = prevText;
            } )
    } );

    $( '#bottominput' ).bind( 'input', function() {
        meme.updateText( this.value, 'bottom' )
            .catch( prevText => {
                this.value = prevText;
            } );
    } );

    $( '#generate' ).click( () => {
        const
            canvas = document.getElementById( 'meme-canvas' );

        html2canvas( canvas, {
            logging: true,
            onrendered: c => {
                c.toBlob( blob => {
                    saveAs( blob, 'meme.png' );
                } );
            }
        } );
    } );

    function colorPick() {
        const color = $( this ).attr( 'id' );
        if( color === 'colorPick1' )
            meme.color = 'white';
        else if( color === 'colorPick2' )
            meme.color = 'black';
        else
            meme.color = 'white';

        meme.redrawCanvas();
    }

    $( '#colorPick1' ).click( colorPick );
    $( '#colorPick2' ).click( colorPick );

    $( '#upload' ).click( () => {
        const
            fileLoad = $( '#fileInput' );

        fileLoad.trigger( 'click' );

        function readURL( input ) {
            if( input.files && input.files[ 0 ] ) {
                const reader = new FileReader();

                reader.onload = function( e ) {
                    meme = new MemeCanvas();
                    meme.drawImage( e.target.result );
                };

                reader.readAsDataURL( input.files[ 0 ] );
            }
        }

        fileLoad.change( function( e ) {
            readURL( this );
        } );
    } );
} );