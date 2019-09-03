const { environment } = require('@rails/webpacker')

module.exports = environment

//https://github.com/rails/webpacker/issues/1174
const config = require('@rails/webpacker/package/config')
const ManifestPlugin = require('webpack-manifest-plugin')
environment.plugins.append('Manifest', new ManifestPlugin({
    publicPath: config.publicPath,
    writeToFileEmit: true,
    filter: f => {
        f.name = f.name.replace(/media\/images\//g, 'media/packs/images/')
      //  f.path = f.path.replace(/\\/g, '/')
        return f
    }
}))