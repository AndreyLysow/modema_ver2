module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Добавьте правило для обработки SVG-файлов
        webpackConfig.module.rules.push({
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        });
  
        return webpackConfig;
      },
    },
  };
  