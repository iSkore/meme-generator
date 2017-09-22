'use strict';

import 'bootstrap';
import Swiper from 'swiper';

$( document ).ready( function() {
    const
        swiper = new Swiper( '.swiper-container', {
            direction: 'horizontal',
            pagination: '.swiper-pagination',
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            paginationClickable: true,
            loop: true,
            slidesPerView: 1
        } );
} );