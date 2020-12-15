
## UI Framework
웹 인터페이스 개발을 위한 UI Framework입니다.
보편적인 웹 개발에서 필요한 UI 모듈 대부분을 포함하고 있습니다.


## 사용 방법

### 1. 체크아웃
```
git clone https://github.com/kk1230t/framework.git
```

### 2. 저장폴더로 이동
```
cd framework
```

### 3. Install all dependencies
```
npm install
```


## 예제
<a href="https://kk1230t.github.io/framework/" target="_blank"><strong>Run this example</strong></a>


## Basic usage

```html
<div data-modules-sticky="padding:0;relativeTarget:#wrap;">
  마크업 내용...
</div>
```

## Injecting a custom tab bar

Suppose we had a custom tab bar called `CustomTabBar`, we would inject
it into our `ScrollableTabView` like this:

```javascript
var ScrollableTabView = require('react-native-scrollable-tab-view');
var CustomTabBar = require('./CustomTabBar');

var App = React.createClass({
  render() {
    return (
      <ScrollableTabView renderTabBar={() => <CustomTabBar someProp={'here'} />}>
        <ReactPage tabLabel="React" />
        <FlowPage tabLabel="Flow" />
        <JestPage tabLabel="Jest" />
      </ScrollableTabView>
    );
  }
});
```
To start you can just copy [DefaultTabBar](https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/DefaultTabBar.js).

## Examples

[SimpleExample](https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/Example/SimpleExample.js).

[ScrollableTabsExample](https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/Example/ScrollableTabsExample.js).

[OverlayExample](https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/Example/OverlayExample.js).

[FacebookExample](https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/Example/FacebookExample.js).

## Props

- **`renderTabBar`** _(Function:ReactComponent)_ - accept 1 argument `props` and should return a component to use as
  the tab bar. The component has `goToPage`, `tabs`, `activeTab` and
  `ref` added to the props, and should implement `setAnimationValue` to
  be able to animate itself along with the tab content. You can manually pass the `props` to the TabBar component.
- **`tabBarPosition`** _(String)_ Defaults to `"top"`.
  - `"bottom"` to position the tab bar below content.
  - `"overlayTop"` or `"overlayBottom"` for a semitransparent tab bar that overlays content. Custom tab bars must consume a style prop on their outer element to support this feature: `style={this.props.style}`.
- **`onChangeTab`** _(Function)_ - function to call when tab changes, should accept 1 argument which is an Object containing two keys: `i`: the index of the tab that is selected, `ref`: the ref of the tab that is selected
- **`onScroll`** _(Function)_ - function to call when the pages are sliding, should accept 1 argument which is an Float number representing the page position in the slide frame.
- **`locked`** _(Bool)_ - disables horizontal dragging to scroll between tabs, default is false.
- **`initialPage`** _(Integer)_ - the index of the initially selected tab, defaults to 0 === first tab.
- **`page`** _(Integer)_ - set selected tab(can be buggy see  [#126](https://github.com/brentvatne/react-native-scrollable-tab-view/issues/126)
- **`children`** _(ReactComponents)_ - each top-level child component should have a `tabLabel` prop that can be used by the tab bar component to render out the labels. The default tab bar expects it to be a string, but you can use anything you want if you make a custom tab bar.
- **`tabBarUnderlineStyle`** _([View.propTypes.style](https://facebook.github.io/react-native/docs/view.html#style))_ - style of the default tab bar's underline.
- **`tabBarBackgroundColor`** _(String)_ - color of the default tab bar's background, defaults to `white`
- **`tabBarActiveTextColor`** _(String)_ - color of the default tab bar's text when active, defaults to `navy`
- **`tabBarInactiveTextColor`** _(String)_ - color of the default tab bar's text when inactive, defaults to `black`
- **`tabBarTextStyle`** _(Object)_ - Additional styles to the tab bar's text. Example: `{fontFamily: 'Roboto', fontSize: 15}`
- **`style`** _([View.propTypes.style](https://facebook.github.io/react-native/docs/view.html#style))_
- **`contentProps`** _(Object)_ - props that are applied to root `ScrollView`/`ViewPagerAndroid`. Note that overriding defaults set by the library may break functionality; see the source for details.
- **`scrollWithoutAnimation`** _(Bool)_ - on tab press change tab without animation.
- **`prerenderingSiblingsNumber`** _(Integer)_ - pre-render nearby # sibling, `Infinity` === render all the siblings, default to 0 === render current page.

## Contribution
**Issues** are welcome. Please add a screenshot of bug and code snippet. Quickest way to solve issue is to reproduce it on one of the examples.

**Pull requests** are welcome. If you want to change API or making something big better to create issue and discuss it first. Before submiting PR please run ```eslint .``` Also all eslint fixes are welcome.

Please attach video or gif to PR's and issues it is super helpful.

<a href="http://www.abeautifulsite.net/recording-a-screencast-with-quicktime/" target="_blank">How to make video</a>

<a href="https://github.com/jclem/gifify" target="_blank">How to make gif from video</a>

---

**MIT Licensed**
