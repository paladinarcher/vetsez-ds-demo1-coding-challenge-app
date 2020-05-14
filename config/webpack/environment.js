const { environment } = require('@rails/webpacker');
const webpack = require('webpack');

environment.plugins.prepend('Provide', new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
        Popper: ['popper.js','default'],
    }));

//https://github.com/rails/webpacker/issues/1174
const config = require('@rails/webpacker/package/config')
const ManifestPlugin = require('webpack-manifest-plugin')
environment.plugins.append('Manifest', new ManifestPlugin({
    publicPath: config.publicPath,
    writeToFileEmit: true,
    filter: f => {
        f.name = f.name.replace(/media\/images\//g, 'media/packs/images/') //Windows builds leave out 'packs'
      //  f.path = f.path.replace(/\\/g, '/')
        return f
    }
}))

module.exports = environment;

//environment['output'] = {};
// environment['config']['output']['library'] = 'packed';
// environment['config']['output']['libraryTarget'] = 'umd';