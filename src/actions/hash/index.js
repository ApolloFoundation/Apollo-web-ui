import config from "../../config"
import { handleFetch } from "../../helpers/fetch"

export const getHashRequest = (data) => {
  return handleFetch(`${config.api.server}/apl`, "GET", {
    ...data,
    requestType: 'hash',
  })
}