/**
 * Created by mattputipong on 9/27/17.
 */

class MemeCanvas {
    constructor( src ) {
        const
            canvas    = document.getElementById( 'meme-canvas' ),
            frontFont = new FontFace( 'FrontFont', 'url( ../fonts/Impact-Regular.ttf )' ),
            backFont  = new FontFace( 'BackFont', 'url( ../fonts/Impact.ttf )' ),
            self = this;

        this.canvas = canvas;
        this.ctx = canvas.getContext( '2d' );

        this.clearCanvas();

        this.ctx.font = '48px FrontFont';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.image = new Image();
        this.image.src = src;
        this.color = '#FFFFFF';
        this.fit = true;
        this.text = {
            top: '',
            bottom: ''
        };

        this.image.onload = function() {
            self.loadImage( this );
        };

        Promise.all( [ frontFont.load(), backFont.load() ] )
            .then( fonts => {
                document.fonts.add( fonts[ 0 ] );
                document.fonts.add( fonts[ 1 ] );
            } );
    }

    loadImage( image ) {
        this.width = image.width;
        this.height = image.height;
        this.hRatio = this.ctx.canvas.width / this.width;
        this.vRatio = this.ctx.canvas.height / this.height;
        this.ratio = Math.min( this.hRatio, this.vRatio );
        this.centerShift_x = ( this.ctx.canvas.width - this.width * this.ratio ) / 2;
        this.centerShift_y = ( this.ctx.canvas.height - this.height * this.ratio ) / 2;

        this.drawImage();
    }

    clearCanvas() {
        this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
    }

    redrawCanvas() {
        this.drawImage()
            .then( () => this.drawText() )
            .catch( console.error );
    }

    drawImage() {
        this.clearCanvas();

        return new Promise( res => {
            if( !this.fit ) {
                res( this.ctx.drawImage( this.image, 0, 0, this.width, this.height ) );
            } else {
                res(
                    this.ctx.drawImage(
                        this.image, 0, 0,
                        this.width, this.height,
                        this.centerShift_x, this.centerShift_y,
                        this.width * this.ratio, this.height * this.ratio
                    )
                );
            }
        } );
    }

    drawText() {
        const
            hRatio     = this.ctx.canvas.width / 2,
            vtRatio    = this.ctx.canvas.height / 6,
            vbRatio    = this.ctx.canvas.height - vtRatio,
            fillTop    = this.textFill( this.ctx, this.text.top, hRatio, vtRatio ),
            fillBottom = this.textFill( this.ctx, this.text.bottom, hRatio, vbRatio );

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
        return new Promise( res => {
            let uppercase  = text.toUpperCase(),
                words      = uppercase.split( ' ' ),
                line       = '',
                lineHeight = 48 * 0.9,
                maxWidth   = $( '#meme-canvas' ).outerWidth();

            for( let n = 0; n < words.length; n++ ) {
                let testLine  = line + words[ n ] + ' ',
                    testWidth = ctx.measureText( testLine ).width;

                if( testWidth > maxWidth && n > 0 ) {
                    ctx.fillStyle = 'white';
                    ctx.fillText( line, x, y );
                    ctx.strokeText( line, x, y );
                    line = words[ n ] + ' ';
                    y += lineHeight;
                } else if( testWidth > maxWidth && n === 0 ) {
                    let prevText = text.substr( 0, text.length - 1 );
                    prevText += '\n';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }

            ctx.fillStyle = 'white';
            ctx.fillText( line, x, y );
            ctx.strokeText( line, x, y );

            ctx.fill();
            ctx.stroke();

            res();
        } );
    }
}

export default MemeCanvas;