/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
            lng: 'en',
            fallbackLng: 'en',
            whitelist: ['en'],
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
                crossDomain: false,
                withCredentials: false,
            },
            debug: false,
            react: {
                wait: true,
                bindI18n: 'languageChanged loaded',
            }
        },
        (err, t) => {
            if (err) return console.log('something went wrong loading', err);
            t('error_invalid_referenced_transaction_hash'); // -> same as i18next.t
        });

export default i18n;