/**
 * @param {string} links
 * @param {string} scripts
 * @returns {string}
 */
export const createIndexTemplate = (links, scripts) => `\
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    ${links}
    ${scripts}
  </head>

  <body>
    <div id="app"></div>
  </body>
</html>
`;
