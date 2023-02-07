import { IS_MODAL_PROCESSING } from "modules/modals";

export const setModalProcessingTrueAction = () => ({
  type: IS_MODAL_PROCESSING,
  payload: true,
});

export const setModalProcessingFalseAction = () => ({
  type: IS_MODAL_PROCESSING,
  payload: false,
});