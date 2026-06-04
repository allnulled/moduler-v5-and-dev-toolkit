module.exports = async function ({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV5/CssModuler/css-output".padEnd(titleColumns) });
  assert(1, "ModulerV5/CssModuler/css-output");
  const Dictionary = ModulerV5.create(devToolkit.fullpathOf("moduler-v5.test/css-output"));
  await Dictionary.mean("./css-example-1.js");
  const info = await Dictionary.css.synchronize();
  assert(info.source === `/*!original:@/css/base/reset.css*/
/*!order:1*/


/*!original:@/css/base.css*/
/*!order:2*/
/*!requires:./base/reset.css*/


/*!original:@/css/framework/box.css*/
/*!order:3*/


/*!original:@/css/framework/table/header.css*/
/*!order:4*/


/*!original:@/css/framework/table/footer.css*/
/*!order:5*/


/*!original:@/css/framework/table/row.css*/
/*!order:6*/


/*!original:@/css/framework/table/column.css*/
/*!order:7*/


/*!original:@/css/framework/table.css*/
/*!order:8*/
/*!requires:./table/header.css*/
/*!requires:./table/footer.css*/
/*!requires:./table/row.css*/
/*!requires:./table/column.css*/


/*!original:@/css/framework.css*/
/*!order:9*/
/*!requires:./framework/box.css*/
/*!requires:./framework/table.css*/


/*!original:@/css/application.css*/
/*!order:10*/


/*!original:@/css/theme.css*/
/*!order:11*/


/*!original:@/css/entry.css*/
/*!order:12*/
/*!requires:./base.css*/
/*!requires:./framework.css*/
/*!requires:./application.css*/
/*!requires:./theme.css*/

`, "Can bundle css modules exactly as expected");
};