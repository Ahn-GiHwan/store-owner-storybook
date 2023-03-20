/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader');

  webFontLoader.load({
    custom: {
      families: ['Spoqa Han Sans', 'Spoqa Han Sans NEO'],
      urls: [
        '//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-kr.css',
        '//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css',
      ],
    },
  });
}
