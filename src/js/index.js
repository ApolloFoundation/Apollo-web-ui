'use strict';

var functions = require('./functions');

/*
 * Exported in 'functions.js' functions can be used here:
 * functions.exportName()
 */

(function () {

	// Code goes here
    var openModalBtn  = document.querySelector('[data-modal="sendMoney"]');
    var closeModalBtn = document.querySelector('[data-close-modal]');
    var modalWindow   = document.querySelector('.modal-window');

    openModalBtn .addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalWindow  .addEventListener('click', modalController);

    function openModal() {
        modalWindow.classList.add('active')
    }

    function closeModal(e) {
        modalWindow.classList.remove('active');
    }

    function modalController(e) {
        if (!e.target.closest('.modal-window .modal-box')) {
            closeModal();
        }
    }


})();
