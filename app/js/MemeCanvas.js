/**
 * Created by mattputipong on 9/27/17.
 */

class MemeCanvas {
    constructor() {
        const
            canvas    = document.getElementById( 'meme-canvas' ),
            frontFont = new FontFace( 'FrontFont', 'url( ../fonts/Impact-Regular.ttf )' ),
            backFont  = new FontFace( 'BackFont', 'url( ../fonts/Impact.ttf )' );

        this.ctx   = canvas.getContext( '2d' );
        this.ctx.font        = '48px FrontFont';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle   = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth   = 2;
        this.image = {};
        this.text  = {
            top : '',
            bottom : ''
        };

        Promise.all( [ frontFont.load(), backFont.load() ] )
            .then( fonts => {
                document.fonts.add( fonts[ 0 ] );
                document.fonts.add( fonts[ 1 ] );
            } );
    }

    drawImage( src ) {
        return new Promise( res => {
            const
                image = new Image(),
                ctx   = this.ctx;

            image.src    = src;
            image.onload = function() {
                res( ctx.drawImage( this, 0, 0, 500, 500 * this.height / this.width ) );
            };

            if ( !this.image.src )
                this.image.src = src;
        } );
    }

    drawText() {
        const
            fillTop    = this.textFill( this.ctx, this.text.top, 250, 50 ),
            fillBottom = this.textFill( this.ctx, this.text.bottom, 250, 290 );

        return Promise.all( [ fillTop, fillBottom ] );
    }

    updateText( text, position ) {
        this.text[ position ] = text;

        return this.drawImage( this.image.src )
            .then( () => this.drawText() )
            .catch( prevText => {
                this.text[ position ] = prevText;
                this.drawText();

                return Promise.reject( prevText );
            } );
    }

    textFill( ctx, text = '', x, y ) {
        return new Promise( ( res, rej ) => {
            let uppercase = text.toUpperCase(),
                words     = uppercase.split( ' ' ),
                line      = '',
                lineHeight = 48 * 0.9,
                maxWidth  = $( '#meme-canvas' ).outerWidth();

            for ( let n = 0; n < words.length; n++ ) {
                let testLine  = line + words[ n ] + ' ',
                    testWidth = ctx.measureText( testLine ).width;

                console.log( testLine );
                if ( testWidth > maxWidth && n > 0 ) {
                    ctx.fillText( line, x, y );
                    ctx.strokeText( line, x, y );
                    line = words[ n ] + ' ';
                }
                else if ( testWidth > maxWidth && n === 0 ) {
                    let prevText = text.substr( 0, text.length - 1 );
                    rej( prevText );
                }
                else {
                    line = testLine;
                }
            }

            ctx.fillText( line, x, y );
            ctx.strokeText( line, x, y );

            ctx.fill();
            ctx.stroke();

            res();
        } );
    }
}

export default MemeCanvas;