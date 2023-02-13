// webpack.config.js

'use strict';

const path = require( 'path' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
    mode:'development',
    // https://webpack.js.org/configuration/entry-context/
    entry: './app.js',

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'bundle.js'
    },
    cache:true,
    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

                use: [ 'raw-loader' ]
            },
            {
                test: [/ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,/^\.css$/],

                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true
                            } )
                        }
                    }
                ]
            },
            {
                test: [/mathtype-html-integration-devkit[/\\]styles[/\\].+\.css$/,/drawpad_plugin[/\\].+\.css$/,/abbreviation[/\\].+\.css$/],

                use: [
                    "css-loader" 
                ]
            },
            {
                test: /mathtype-html-integration-devkit[/\\]styles[/\\].+\.svg$/,

                use: [
                    "svg-url-loader" 
                ]
            },
            {
                test: /mathtype-ckeditor5[/\\].+\.svg$/,
                use: {
                    loader: 'raw-loader'
                }
            }
        ]
    },

    // Useful for debugging.
    devtool: 'source-map',

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false },

    /* The stats option lets you control what bundling information to display. */
    devServer: {
        // stats: {
        //     children: false, // Hide children information
        //     maxModules: 0 // Set the maximum number of modules to be shown
        // },
        port: 3001,
        static: [
            {
                directory: path.join(__dirname, 'public'),
                publicPath: '/',
            },
            {
                directory: path.join(__dirname, 'dist'),
                publicPath: '/js',
            }
        ],
        liveReload:true,
        hot:false,
        watchFiles: ['*'],
        // historyApiFallback:true,
    },
};
