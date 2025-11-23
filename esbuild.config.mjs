/**
 * esbuild configuration for Angular 20 to handle font files from primeicons and other libraries.
 * This file configures loaders for .eot, .woff, .woff2, .ttf, and .svg font files.
 */

export default {
  plugins: [
    {
      name: 'font-loader',
      setup(build) {
        // Handle .eot files
        build.onLoad({ filter: /\.eot(\?.*)?$/ }, async (args) => {
          return {
            contents: await require('fs').promises.readFile(args.path),
            loader: 'file',
          };
        });

        // Handle .woff2 files
        build.onLoad({ filter: /\.woff2(\?.*)?$/ }, async (args) => {
          return {
            contents: await require('fs').promises.readFile(args.path),
            loader: 'file',
          };
        });

        // Handle .woff files
        build.onLoad({ filter: /\.woff(\?.*)?$/ }, async (args) => {
          return {
            contents: await require('fs').promises.readFile(args.path),
            loader: 'file',
          };
        });

        // Handle .ttf files
        build.onLoad({ filter: /\.ttf(\?.*)?$/ }, async (args) => {
          return {
            contents: await require('fs').promises.readFile(args.path),
            loader: 'file',
          };
        });

        // Handle .svg files (for fonts)
        build.onLoad({ filter: /\.svg(\?.*)?$/ }, async (args) => {
          return {
            contents: await require('fs').promises.readFile(args.path),
            loader: 'file',
          };
        });
      },
    },
  ],
};
