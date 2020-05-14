const archiver = require('archiver-promise');
const path = require('path');
const sanitize = require('sanitize-filename');

function zipFiles(files, filename, source, destination, info, verbose) {
    const target = path.join(destination, filename);
    if (info) console.log(`Archive: ${target}`);

    let archive = archiver(target);
    files.forEach(file => {
        if (verbose) console.log(file);
        archive.file(file);
    });
    archive.directory('./build', 'apollo-wallet/webui');
    return archive.finalize();
}

function pack({destination, info, verbose, name, includes}) {
    const source = './build';
    const files = ['./pkg-apollo-web-ui.json'];
    name = name ? '.' + name : '';
    return zipFiles(
        files,
        `apollo-web-ui-${sanitize(process.env.npm_package_version)}${name}.zip`,
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
}).then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

module.exports = {
    pack
};
