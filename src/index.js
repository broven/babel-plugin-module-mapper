const getExportNameFromNodeArr = arr =>
  arr.map(node => {
    if (node.type === 'ImportDefaultSpecifier') return node.local.name;
    return node.imported.name;
  });
const getImportSpecifierLocalName = s => s.local.name;
const getInfoFromObject = ({ loc }) => [loc.identifierName];

module.exports = function MapperPlugin({ types: t }) {
  return {
    visitor: {
      Identifier(path) {
        return;
      },
      ImportDeclaration(path, state) {
        // normal case
        // moduleName: node.source.value
        // importValue: node.specifiers[...].local.name
        const opt = state.opts;
        const moduleName = path.node.source.value;
        const ExportPropertyArr = getExportNameFromNodeArr(
          path.node.specifiers
        );
        if (!opt.hasOwnProperty(moduleName)) return;
        ExportPropertyArr.forEach((propertyName, index) => {
          if (!opt[moduleName].hasOwnProperty(propertyName)) return;
          // delete this property
          const localName = getImportSpecifierLocalName(
            path.node.specifiers[index]
          );
          delete path.node.specifiers[index];
          // add a new import line //TODO: 考虑重复映射的问题， 多个其他property映射到同一个module
          const [destModuleName, destExportName] = opt[moduleName][
            propertyName
          ];
          // importSpecifier (local, imported)  -> import { imported as local } from 'source'
          const specifier =
            destExportName === 'default'
              ? t.importDefaultSpecifier(t.Identifier(localName))
              : t.importSpecifier(
                  t.Identifier(localName),
                  t.Identifier(destExportName)
                );
          path.insertAfter(
            t.importDeclaration([specifier], t.StringLiteral(destModuleName))
          );
          if (path.node.specifiers.length === 1) {
            path.remove();
            return;
          }
        });
      },
      MemberExpression(path, state) {
        // const opt = state.opts;
        // const node = path.node;
        // Object.keys(opt).forEach(moduleName => {
        //   Object.keys(
        //     opt[moduleName]).forEach(property => {
        //       if (t.isIdentifier(node.object, { name: opt[property] })) {
        //         if (t.isIdentifier(node.property, { name: property })) {
        //           // a.b
        //           const [destModuleName, destExportName] = opt[moduleName][
        //             property
        //           ];
        //           path.replaceWith(
        //             // https://babeljs.io/docs/en/next/babel-types.html#memberexpression
        //             t.Identifier(destExportName)
        //           );
        //         }
        //       }
        //     })
        // });
      }
    }
  };
};
