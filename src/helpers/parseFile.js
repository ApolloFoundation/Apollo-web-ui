const chunkSize = 1000 * 1024; // bytes

export const parseFile = (file) =>
  new Promise((resolve, reject) => {
    const data = {
      size: file.size,
      name: file.name,
      type: file.type,
      path: file.path,
      file: null,
      chunks: [],
    };

    let offset = 0;

    const chunkReaderBlock = (_offset, length, _file) => {
      const reader = new FileReader();
      const blob = _file.slice(_offset, length + _offset);
      reader.onload = readEventHandler(blob);
      reader.readAsArrayBuffer(blob);
    };

    const readEventHandler =
      (blob) =>
      ({ target }) => {
        if (target.error === null) {
          data.chunks.push({
            offset,
            blob,
            size: blob.size,
            file: target.result,
          });
          offset += blob.size;
        } else {
          reject(new Error(target.error));
        }
        if (data.file && offset >= data.size) {
          resolve(data);
        }

        chunkReaderBlock(offset, chunkSize, file);
      };

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      data.file = target.result;

      if (offset >= data.size) {
        resolve(data);
      }
    };
    reader.readAsArrayBuffer(file);

    chunkReaderBlock(offset, chunkSize, file);
  });

export const parseTextFile = (file) =>
  new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        resolve(target.result);
      };
      reader.readAsText(file);
    } catch (e) {
      reject(e);
    }
  });
