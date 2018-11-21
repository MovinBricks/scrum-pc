const path = require('path');

/**
 * 加载应用根模板
 *
 * @class TemplateLoader
 */
class TemplateLoader {
    get name() { return 'template-loader'; }

    async exec(siteGlobal) {
        siteGlobal.templatePath = path.resolve('./client/index.template.html');

        return true;
    }
}

module.exports = TemplateLoader;
