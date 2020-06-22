const archiver = require('archiver-promise');
const path = require('path');
const sanitize = require('sanitize-filename');
const crypto = require('crypto');
const fs = require('fs');

function zipFiles(files, filename, source, destination, info, verbose) {
  const target = path.join(destination, filename);
  if (info) console.log(`Archive: ${target}`);

  let archive = archiver(target);
  files.forEach(file => {
    if (verbose) console.log(file);
    archive.directory(file, 'ApolloWallet');
  });
  archive.directory('./build', 'ApolloWallet/apollo-web-ui');
  return archive.finalize();
}

function pack({destination, info, verbose, name, includes}) {
  const source = './build';
  const files = ['./packaging/pkg-apollo-web-ui.json'];
  return zipFiles(
    files,
    `apollo-web-ui-${sanitize(process.env.npm_package_version)}-NoOS-NoArch.zip`,
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
  const fileName = `apollo-web-ui-NoOS-NoArch-${sanitize(process.env.npm_package_version)}.zip`;
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
