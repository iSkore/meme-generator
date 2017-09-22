'use strict';

import $ from 'jquery';
import Popper from 'popper.js';

window.jQuery = $;
window.Popper = Popper;

require( 'bootstrap' );

console.log( 'global' );