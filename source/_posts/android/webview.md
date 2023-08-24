---
title: WebView 加载网页组件
date: 2020-05-17 11:49:29
categories: Android
tags: 
    - WebView
---

## WebView

> #### WebView 加载网页的方式

##### 加载网络 URL:

`webview.loadUrl("http//...");`

##### 加载 assets 下的 HTML 文件：

`webview.loadUrl("file://android_asset/test.html");`

##### 加载 HTML 代码：

`webview.loadData();` 或 `webview.loadDataWithBaseURL();//推荐使用`

> #### 网页的前进后退

##### 判断网页是否还有上一级是否还能返回：

`webview.canGoBack();`

##### 返回上一级：

`webview.goBack();`

##### 前进(同理)：

`webview.canGoForward();//是否能前进`
`webview.goForward();//前进`

##### 传参控制前进后退：

`webview.canGoBackOrForward(int);//正数是否能前进正数步,负数后退`
`webview.goBackOrForward(int);//正数前进正数步，负数同理`

---

### WebView 网络 URL 使用

-   在 APP 中使用网络需要网络权限。先在 AndroidManifest.xml 文件中的 manifest 标签内添加下面这段代码：
    `<uses-permission android:name="android.permission.INTERNET" />`

-   在 activity 布局中使用 webView 组件：

```xml
<WebView
    android:id="@+id/webView"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

-   Java 文件 activity 中

```java
private WebView webView;
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_stagger);

    webView = findViewById(R.id.webView);
    //加载网页，默认不支持javascript，因此网页还是加载不出来
    webView.loadUrl("https://ruoxijun.github.io/");
    //一般将URL写在下面这些设置的最后面，url还可以是js代码会被执行
    //设置支持使用javascript此时能看见网页了。
    webView.getSettings().setJavaScriptEnabled(true);
    /**此时你在此页面点击一个连接它会使用浏览器打开，
        * 但我们希望它就在当前APP内打开。进行如下设置
        * 此设置需要一个 WebViewClient 做参数，
        * 用一个类继承它并重写一部分我们需要的方法。
        */
    webView.setWebViewClient(new MyWebClient());
    /**对网页的属性以及网页加载进度相关设置，
        * 它需要 WebViewClient 对象,我们同样用一个类继承它
        */
    webView.setWebChromeClient(new MyChromeClient());
}

//键盘(按钮)监听事件，keycode表示按下的键的值
public boolean onKeyDown(int keyCode, KeyEvent event) {
    //当按下返回键时 且 web存在上一级时(可后退)
    if ((keyCode == KeyEvent.KEYCODE_BACK)&&webView.canGoBack()){
        webView.goBack();//web后退一步
        return true;//事件不再传递(不退出web页面)
    }
    return super.onKeyDown(keyCode, event);
}

//web视图相关类
class MyWebClient extends WebViewClient{
    //设置当前页面中的请求
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        //将当前页面的URL设置为此时用户请求的URL
        view.loadUrl(request.getUrl().toString());
        return true;
    }

    //页面开始加载
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
        Log.d("webview","网页开始加载");
    }

    //页面加载结束
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        Log.d("webview","网页加载结束");
    }
}

//web相关类
class MyChromeClient extends WebChromeClient{
    //网页加载的进度(),newProgress值0-100,100时表示网页加载完毕
    public void onProgressChanged(WebView view, int newProgress) {
        super.onProgressChanged(view, newProgress);
    }

    //当前网页的标题
    public void onReceivedTitle(WebView view, String title) {
        super.onReceivedTitle(view, title);
        setTitle(title);//将当前Activity的标题设置为网页的标题
    }
}
```
