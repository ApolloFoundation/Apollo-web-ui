const archiver = require('archiver-promise');
const path = require('path');
const sanitize = require('sanitize-filename');
const crypto = require('crypto');
const fs = require('fs');

function zipFiles(files, filename, source, destination, info, verbose) {
  const target = path.join(destination, filename);
  if (info) console.log(`Archive: ${target}`);

  let archive = archiver(target);
  archive.directory(source, 'ApolloWallet/apollo-web-ui');
  archive.directory(files, 'ApolloWallet/packaging');
  return archive.finalize();
}

function pack({destination, info, verbose, name, includes}) {
  const source = './build';
  const files = './packaging';
  const fileName = `apollo-web-ui-${sanitize(process.env.npm_package_version)}-NoOS-NoArch.zip`;
  return zipFiles(
    files,
    fileName,
    source,
    destination,
    info,
    verbose
  );
}

pack({
  source: '',
  destination: './target',
  name: false,
  info: true
}).then(() => {
  const fileName = `apollo-web-ui-${sanitize(process.env.npm_package_version)}-NoOS-NoArch.zip`;
  const fileBuffer = fs.readFileSync(`target/${fileName}`);
  const sum = crypto.createHash('sha256');
  sum.update(fileBuffer);
  const hex = sum.digest('hex');
  fs.writeFile(`target/${fileName}.sha256`, hex, function (error) {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0)
  });
}).catch(error => {
  console.error(error);
  process.exit(1);
});

module.exports = {
  pack
};
