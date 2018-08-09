import React from 'react';

import {LANGUAGES_DATA} from './languages-data'
import {LOCALE_DATA} from './locale-data'

var CURRENT_LOCALE = {};

let SORTED_LOCALE_DATE = Object.keys(LOCALE_DATA).sort(function(a,b) {
    return LOCALE_DATA[a].displayName.localeCompare(LOCALE_DATA[b].displayName);
});

// TODO: import from the login page
export function getLocaleList() {
    return SORTED_LOCALE_DATE;
};


// TODO: import language options at the login page

// Receive only objects
export const CustomLanguagesSelect = (props) => (
    <select>
        {
            props.default &&
            <option value="default">{props.default}</option>
        }
        {
            Object.values(props.options).map((el) => {
                return <option value={el}>{props.options[el]}</option>
            })
        }
    </select>
);

export function applySettings(key) {
    // return (dispatch, getState) => {
    //     const {account} = getState();
    //
    //     // if (!key || key == "language") {
    //     //     if ($.i18n.language != NRS.settings["language"]) {
    //     //         $.i18n.changeLanguage(NRS.settings["language"], function() {
    //     //             $("[data-i18n]").i18n();
    //     //         });
    //     //         if (key) {
    //     //             NRS.setStrItem('i18next_lng', NRS.settings["language"]);
    //     //         }
    //     //     }
    //     // }
    //
    //     if (!key || key == "submit_on_enter") {
    //         if (account.settings["submit_on_enter"] == "1") {
    //             $(".modal form:not('#decrypt_note_form_container')").on("submit.onEnter", function(e) {
    //                 e.preventDefault();
    //                 NRS.submitForm($(this).closest(".modal"));
    //             });
    //         } else {
    //             $(".modal form").off("submit.onEnter");
    //         }
    //     }
    //
    //     if (!key || key == "animate_forging") {
    //         var forgingIndicator = $("#forging_indicator");
    //         if (account.settings["animate_forging"] == "1") {
    //             forgingIndicator.addClass("animated");
    //         } else {
    //             forgingIndicator.removeClass("animated");
    //         }
    //     }
    //
    //     if (!key || key == "items_page") {
    //         NRS.itemsPerPage = parseInt(NRS.settings["items_page"], 10);
    //     }
    //
    //     if (!NRS.downloadingBlockchain) {
    //         if (!key || key == "console_log") {
    //             if (NRS.settings["console_log"] == "0") {
    //                 $("#show_console").hide();
    //             } else {
    //                 $("#show_console").show();
    //             }
    //         }
    //     }
    //
    //     if (key == "24_hour_format") {
    //         var $dashboard_dates = $("#dashboard_table").find("a[data-timestamp]");
    //         $.each($dashboard_dates, function() {
    //             $(this).html(NRS.formatTimestamp($(this).data("timestamp")));
    //         });
    //     }
    //
    //     if (!key || key == "admin_password") {
    //         if (NRS.settings["admin_password"] != "") {
    //             NRS.updateForgingStatus();
    //         }
    //     }
    // }
};

export function getLocale() {
    return (dispatch, getState) => {
        const {account} = getState();

        var lang;

        if (account.settings && account.settings['regional_format'] !== "default") {
            lang = account.settings['regional_format'];
        } else {

            lang = window.javaFxLanguage || window.navigator.userLanguage || window.navigator.language;
            if (!LOCALE_DATA[lang]) {
                if (lang && lang.length == 2) {
                    // Attempt to expand the Chrome two letter language to country specific locale
                    if (window.navigator.languages) {
                        var tokens = String(window.navigator.languages).split(",");
                        for (var i=0; i<tokens.length; i++) {
                            var separator = tokens[i].indexOf("-");

                            if (separator == -1) {
                                continue;
                            }
                            if (tokens[i].substring(0, separator) == lang) {
                                account.logConsole("Language " + lang + " resolved to locale " + tokens[i]);
                                lang = tokens[i];
                                break;
                            }
                        }
                    }
                }
                if (!LOCALE_DATA[lang]) {
                    if (!CURRENT_LOCALE.lang) {
                        console.log("Cannot find locale definitions for language " + lang + " default to en-US");
                    }
                    lang = "en-US";
                }
            }
        }

        if (!CURRENT_LOCALE || !CURRENT_LOCALE.lang || CURRENT_LOCALE.lang != lang) {
            CURRENT_LOCALE = {};
            CURRENT_LOCALE.lang = lang;
            CURRENT_LOCALE.dateFormat = LOCALE_DATA[lang].dateFormat;

            CURRENT_LOCALE.decimal = LOCALE_DATA[lang].decimal;
            CURRENT_LOCALE.section = LOCALE_DATA[lang].section;
            CURRENT_LOCALE.displayName = LOCALE_DATA[lang].displayName;
            console.log("Locale language: '" + CURRENT_LOCALE.lang +
                "' date format: '" + CURRENT_LOCALE.dateFormat +
                "' decimal separator: '" + CURRENT_LOCALE.decimal +
                "' section separator: '" + CURRENT_LOCALE.section +
                "' display name: '" + CURRENT_LOCALE.displayName + "'");
        }
        return CURRENT_LOCALE;
    }
};