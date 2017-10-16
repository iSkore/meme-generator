'use strict';

import 'bootstrap';

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import MemeCanvas from './MemeCanvas';

$( document ).ready( function() {
    const
        topInput = $( '#topinput' ),
        bottomInput = $( '#bottominput' );

    let meme;

    meme = new MemeCanvas('assets/memes/Baby-Sammy.png');

    topInput.bind( 'input', function() {
        meme.updateText( this.value, 'top' )
            .catch( prevText => {
                this.value = prevText;
            } );
    } );

    bottomInput.bind( 'input', function() {
        meme.updateText( this.value, 'bottom' )
            .catch( prevText => {
                this.value = prevText;
            } );
    } );

    $( '#generate' ).click( () => {
        const
            canvas = $( '#meme-canvas' ),
            origin = {
                top: canvas.css( 'top' ),
                left: canvas.css( 'left' ),
                position: canvas.css( 'position' )
            },
            transport = {
                top: 0,
                left: 0,
                position: 'fixed'
            };

        canvas.css( transport );

        html2canvas( canvas, {
            width: canvas.width(),
            height: canvas.height(),
            letterRendering: true,
            onrendered: c => {
                canvas.css( origin );

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

    const fit = $( '#fit' );

    fit.click( e => {
        e.preventDefault();

        if( meme.fit ) {
            fit.removeClass( 'btn-success' );
            fit.addClass( 'btn-secondary' );
        } else {
            fit.removeClass( 'btn-secondary' );
            fit.addClass( 'btn-success' );
        }

        meme.fit = !meme.fit;
        meme.redrawCanvas();
    } );

    $( '#upload' ).click( () => {
        const
            fileLoad = $( '#fileInput' );

        fileLoad.trigger( 'click' );

        function readURL( input ) {
            if( input.files && input.files[ 0 ] ) {
                const reader = new FileReader();

                reader.onload = function( e ) {
                    meme = new MemeCanvas( e.target.result );
                    topInput.trigger( 'input' );
                    bottomInput.trigger( 'input' );
                };

                reader.readAsDataURL( input.files[ 0 ] );
            }
        }

        fileLoad.change( function() {
            readURL( this );
        } );
    } );
} );