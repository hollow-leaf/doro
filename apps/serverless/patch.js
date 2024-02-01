import parser from '@babel/parser';
import generator from '@babel/generator';
import traverse from '@babel/traverse';
import fs from 'fs';

const path = './node_modules/o1js/dist/node/index.js'
const code = fs.readFileSync(path, 'utf-8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx'],
});

const replacementCode = `
  (function() {
    function FinalizationRegistry(callback) {
      if (!(this instanceof FinalizationRegistry)) {
        throw new TypeError("Cannot call a class as a function");
      }

      this.register = function(obj, data) {
        // Your custom implementation for register
      };

      this.unregister = function(obj) {
        // Your custom implementation for unregister
      };

      this.free = function(obj) {
        // Your custom implementation for free
      };

      // Assuming the callback parameter is used in your custom logic
      callback(this);
    }

    return FinalizationRegistry;
  })()
`;
let replacedFinalizationRegistry = false;
traverse.default(ast, {
  // 遍歷 AST，找到對 FinalizationRegistry 的引用
  Identifier(path) {
    if (!replacedFinalizationRegistry && path.isReferenced() && path.node.name === 'FinalizationRegistry') {
      console.log('Found FinalizationRegistry')
      // 這裡你可以插入自定義邏輯，或者將它替換為你的空方法
      path.replaceWithSourceString(replacementCode);
      replacedFinalizationRegistry = true; 
    }
  },
});

const modifiedCode = generator.default(ast).code;

// 將修改後的代碼寫回文件
fs.writeFileSync(path, modifiedCode, 'utf-8');
