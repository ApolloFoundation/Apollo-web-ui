import axios from 'axios';

// const CancelToken = axios.CancelToken;
// const cancelAxiosSource = CancelToken.source();

class CancelRequest {
  token = null;
  source = null;
  constructor() {
    this.update();
  }

  update = () => {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    this.token = this.source.token;
  }

  cancelRequests = () => {
    this.source.cancel();
    this.token = null;
  }
}

export default new CancelRequest();