(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{308:function(e,t,n){"use strict";n.r(t),t.default="# Apache ECharts 5 Upgrade Guide\n\nThis guide is for those who want to upgrade from echarts 4.x (hereafter `v4`) to echarts 5.x (hereafter `v5`). You can find out what new features `v5` brings that are worth upgrading in [New Features in ECharts 5](${lang}/basics/release-note/v5-feature). In most cases, developers won't need to do anything extra for this upgrade, as echarts has always tried to keep the API as stable and backward-compatible as possible. However, `v5` still brings some breaking changes that require special attention. In addition, in some cases, `v5` provides a better API to replace the previous one, and these superseded APIs will no longer be recommended (though we have tried to be as compatible as possible with these changes). We'll try to explain these changes in detail in this document.\n\n## Breaking Changes\n\n#### Default theme\n\nFirst of all, the default theme has been changed. `v5` has made a lot of changes and optimizations on the theme design. If you still want to keep the colors of the old version, you can manually declare the colors as follows.\n\n```js\nchart.setOption({\n  color: [\n    '#c23531',\n    '#2f4554',\n    '#61a0a8',\n    '#d48265',\n    '#91c7ae',\n    '#749f83',\n    '#ca8622',\n    '#bda29a',\n    '#6e7074',\n    '#546570',\n    '#c4ccd3'\n  ]\n  // ...\n});\n```\n\nOr, to make a simple `v4` theme.\n\n```js\nvar themeEC4 = {\n  color: [\n    '#c23531',\n    '#2f4554',\n    '#61a0a8',\n    '#d48265',\n    '#91c7ae',\n    '#749f83',\n    '#ca8622',\n    '#bda29a',\n    '#6e7074',\n    '#546570',\n    '#c4ccd3'\n  ]\n};\nvar chart = echarts.init(dom, themeEC4);\nchart.setOption(/* ... */);\n```\n\n#### Importing ECharts\n\n##### Removing Support for Default Exports\n\nSince `v5`, echarts only provides `named exports`.\n\nSo if you are importing `echarts` like this:\n\n```js\nimport echarts from 'echarts';\n// Or import core module\nimport echarts from 'echarts/lib/echarts';\n```\n\nIt will throw error in `v5`. You need to change the code as follows to import the entire module.\n\n```js\nimport * as echarts from 'echarts';\n// Or\nimport * as echarts from 'echarts/lib/echarts';\n```\n\n##### tree-shaking API\n\nIn 5.0.1, we introduced the new [tree-shaking API](${lang}/basics/import)\n\n```js\nimport * as echarts from 'echarts/core';\nimport { BarChart } from 'echarts/charts';\nimport { GridComponent } from 'echarts/components';\n// Note that the Canvas renderer is no longer included by default and needs to be imported explictly, or import the SVGRenderer if you need to use the SVG rendering mode\nimport { CanvasRenderer } from 'echarts/renderers';\n\necharts.use([BarChart, GridComponent, CanvasRenderer]);\n```\n\nTo make it easier for you to know which modules you need to import based on your option, our new example page adds a new feature to generate the three-shakable code, you can check the `Full Code` tab on the example page to see the modules you need to introduce and the related code.\n\nIn most cases, we recommend using the new tree-shaking interface whenever possible, as it maximizes the power of the packaging tool tree-shaking and effectively resolves namespace conflicts and prevents the exposure of internal structures. If you are still using the CommonJS method of writing modules, the previous approach is still supported:\n\n```js\nconst echarts = require('echarts/lib/echarts');\nrequire('echarts/lib/chart/bar');\nrequire('echarts/lib/component/grid');\n```\n\nSecond, because our source code has been rewritten using TypeScript, `v5` will no longer support importing files from `echarts/src`. You need to change it to import from `echarts/lib`.\n\n##### Dependency Adjustment\n\n> Note: This section is only for developers who use tree-shaking interfaces to ensure a minimal bundle size, not for those who imports the whole package.\n\nIn order to keep the size of the bundle small enough, we remove some dependencies that would have been imported by default. For example, as mentioned above, when using the new on-demand interface, `CanvasRenderer` is no longer introduced by default, which ensures that unneeded Canvas rendering code is not imported when only SVG rendering mode is used, and in addition, the following dependencies are adjusted.\n\n- The right-angle coordinate system component is no longer introduced by default when using line charts and bar charts, so the following introduction method was used before\n\n```js\nconst echarts = require('echarts/lib/echarts');\nrequire('echarts/lib/chart/bar');\nrequire('echarts/lib/chart/line');\n```\n\nNeed to introduce the `grid` component separately again\n\n```js\nrequire('echarts/lib/component/grid');\n```\n\nReference issues: [#14080](https://github.com/apache/echarts/issues/14080), [#13764](https://github.com/apache/echarts/issues/13764)\n\n- `aria` components are no longer imported by default. You need import it manually if necessary.\n\n```js\nimport { AriaComponent } from 'echarts/components';\necharts.use(AriaComponent);\n```\n\nOr\n\n```js\nrequire('echarts/lib/component/aria');\n```\n\n#### Removes Built-in GeoJSON\n\n`v5` removes the built-in geoJSON (previously in the `echarts/map` folder). These geoJSON files were always sourced from third parties. If users still need them, they can go get them from the old version, or find more appropriate data and register it with ECharts via the registerMap interface.\n\n#### Browser Compatibility\n\nIE8 is no longer supported by `v5`. We no longer maintain and upgrade the previous [VML renderer](https://github.com/ecomfe/zrender/tree/4.3.2/src/vml) for IE8 compatibility. If developers have a strong need for a VML renderer, they are welcome to submit a pull request to upgrade the VML renderer or maintain a separate third-party VML renderer, as we support registration of standalone renderers starting with `v5.0.1`.\n\n#### ECharts configuration item adjustment\n\n##### Visual style settings priority change\n\nThe priority of the visuals between [visualMap component](${optionPath}visualMap) and [itemStyle](${optionPath}series-scatter.itemStyle) | [lineStyle](${optionPath}series-scatter.lineStyle) | [areaStyle](${optionPath}series-scatter.areaStyle) are reversed since `v5`.\n\nThat is, previously in `v4`, the visuals (i.e., color, symbol, symbolSize, ...) that generated by [visualMap component](${optionPath}visualMap) has the highest priority, which will overwrite the same visuals settings in [itemStyle](${optionPath}series-scatter.itemStyle) | [lineStyle](${optionPath}series-scatter.lineStyle) | [areaStyle](${optionPath}series-scatter.areaStyle). That brought troubles when needing to specify specific style to some certain data items while using [visualMap component](${optionPath}visualMap). Since `v5`, the visuals specified in [itemStyle](${optionPath}series-scatter.itemStyle) | [lineStyle](${optionPath}series-scatter.lineStyle) | [areaStyle](${optionPath}series-scatter.areaStyle) has the highest priority.\n\nIn most cases, users will probably not notice this change when migrating from `v4` to `v5`. But users can still check that if [visualMap component](${optionPath}visualMap) and [itemStyle](${optionPath}series-scatter.itemStyle) | [lineStyle](${optionPath}series-scatter.lineStyle) | [areaStyle](${optionPath}series-scatter.areaStyle) are both specified.\n\n##### `padding` for Rich Text\n\n`v5` adjusts the [rich.?.padding](${optionPath}series-scatter.label.rich.<style_name>.padding) to make it more compliant with CSS specifications. In `v4`, for example `rich. .padding: [11, 22, 33, 44]` means that `padding-top` is `33` and `padding-bottom` is `11`. The position of the top and bottom is adjusted in `v5`, `rich. .padding: [11, 22, 33, 44]` means that `padding-top` is `11` and `padding-bottom` is `33`.\n\nIf the user is using [rich.?.padding](${optionPath}series-scatter.label.rich.<style_name>.padding), this order needs to be adjusted.\n\n## ECharts Related Extensions\n\nThese extensions need to be upgraded to new version to support echarts `v5`:\n\n- [echarts-gl](https://github.com/ecomfe/echarts-gl)\n- [echarts-wordcloud](https://github.com/ecomfe/echarts-wordcloud)\n- [echarts-liquidfill](https://github.com/ecomfe/echarts-liquidfill)\n\n## Deprecated API\n\nSome of the API and echarts options are deprecated since `v5`, but are still backward compatible. Users can **keep using these deprecated API**, with only some warning will be printed to console in dev mode. But if users have spare time, it is recommended to upgraded to new API for the consideration of long term maintenance.\n\nThe deprecated API and their corresponding new API are listed as follows:\n\n- Transform related props of a graphic element are changed:\n  - Changes:\n    - `position: [number, number]` are changed to `x: number`/`y: number`.\n    - `scale: [number, number]` are changed to `scaleX: number`/`scaleY: number`.\n    - `origin: [number, number]` are changed to `originX: number`/`originY: number`.\n  - The `position`, `scale` and `origin` are still supported but deprecated.\n  - It effects these places:\n    - In the `graphic` components: the declarations of each element.\n    - In `custom series`: the declarations of each element in the return of `renderItem`.\n    - Directly use zrender graphic elements.\n- Text related props on graphic elements are changed:\n  - Changes:\n    - The declaration of attached text (or say, rect text) are changed.\n      - Prop `style.text` are deprecated in elements except `Text`. Instead, Prop set `textContent` and `textConfig` are provided to support more powerful capabilities.\n      - These related props at the left part below are deprecated. Use the right part below instead.\n        - textPosition => textConfig.position\n        - textOffset => textConfig.offset\n        - textRotation => textConfig.rotation\n        - textDistance => textConfig.distance\n    - The props at the left part below are deprecated in `style` and `style.rich.?`. Use the props at the right part below instead.\n      - textFill => fill\n      - textStroke => stroke\n      - textFont => font\n      - textStrokeWidth => lineWidth\n      - textAlign => align\n      - textVerticalAlign => verticalAlign);\n      - textLineHeight =>\n      - textWidth => width\n      - textHeight => hight\n      - textBackgroundColor => backgroundColor\n      - textPadding => padding\n      - textBorderColor => borderColor\n      - textBorderWidth => borderWidth\n      - textBorderRadius => borderRadius\n      - textBoxShadowColor => shadowColor\n      - textBoxShadowBlur => shadowBlur\n      - textBoxShadowOffsetX => shadowOffsetX\n      - textBoxShadowOffsetY => shadowOffsetY\n    - Note: these props are not changed:\n      - textShadowColor\n      - textShadowBlur\n      - textShadowOffsetX\n      - textShadowOffsetY\n  - It effects these places:\n    - In the `graphic` components: the declarations of each element. [compat, but not accurately the same in some complicated cases.]\n    - In `custom series`: the declarations of each element in the return of `renderItem`. [compat, but not accurately the same in some complicated cases].\n    - Directly use zrender API to create graphic elements. [No compat, breaking change].\n- API on chart instance:\n  - `chart.one(...)` is deprecated.\n- `label`:\n  - In props `color`, `textBorderColor`, `backgroundColor` and `borderColor`, the value `'auto'` is deprecated. Use the value `'inherit'` instead.\n- `hoverAnimation`:\n  - option `series.hoverAnimation` is deprecated. Use `series.emphasis.scale` instead.\n- `line series`:\n  - option `series.clipOverflow` is deprecated. Use `series.clip` instead.\n- `custom series`:\n  - In `renderItem`, the `api.style(...)` and `api.styleEmphasis(...)` are deprecated. Because it is not really necessary and hard to ensure backward compatibility. Users can fetch system designated visual by `api.visual(...)`.\n- `sunburst series`:\n  - Action type `highlight` is deprecated. Use `sunburstHighlight` instead.\n  - Action type `downplay` is deprecated. Use `sunburstUnhighlight` instead.\n  - option `series.downplay` is deprecated. Use `series.blur` instead.\n  - option `series.highlightPolicy` is deprecated. Use `series.emphasis.focus` instead.\n- `pie series`:\n  - The action type at the left part below are deprecated. Use the right part instead:\n    - `pieToggleSelect` => `toggleSelect`\n    - `pieSelect` => `select`\n    - `pieUnSelect` => `unselect`\n  - The event type at the left part below are deprecated. Use the right part instead:\n    - `pieselectchanged` => `selectchanged`\n    - `pieselected` => `selected`\n    - `pieunselected` => `unselected`\n  - option `series.label.margin` is deprecated. Use `series.label.edgeDistance` instead.\n  - option `series.clockWise` is deprecated. Use `series.clockwise` instead.\n  - option `series.hoverOffset` is deprecated. Use `series.emphasis.scaleSize` instead.\n- `map series`:\n  - The action type at the left part below are deprecated. Use the right part instead:\n    - `mapToggleSelect` => `toggleSelect`\n    - `mapSelect` => `select`\n    - `mapUnSelect` => `unselect`\n  - The event type at the left part below are deprecated. Use the right part instead:\n    - `mapselectchanged` => `selectchanged`\n    - `mapselected` => `selected`\n    - `mapunselected` => `unselected`\n  - option `series.mapType` is deprecated. Use `series.map` instead.\n  - option `series.mapLocation` is deprecated.\n- `graph series`:\n  - option `series.focusNodeAdjacency` is deprecated. Use `series.emphasis: { focus: 'adjacency'}` instead.\n- `gauge series`:\n  - option `series.clockWise` is deprecated. Use `series.clockwise` instead.\n  - option `series.hoverOffset` is deprecated. Use `series.emphasis.scaleSize` instead.\n- `dataZoom component`:\n  - option `dataZoom.handleIcon` need prefix `path://` if using SVGPath.\n- `radar`:\n  - option `radar.name` is deprecated. Use `radar.axisName` instead.\n  - option `radar.nameGap` is deprecated. Use `radar.axisNameGap` instead.\n- Parse and format:\n  - `echarts.format.formatTime` is deprecated. Use `echarts.time.format` instead.\n  - `echarts.number.parseDate` is deprecated. Use `echarts.time.parse` instead.\n  - `echarts.format.getTextRect` is deprecated.\n"}}]);