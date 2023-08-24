---
title: android 杂记
date: 2020-05-31 14:35:57
categories: Android
tags: 
    - toast
    - alertdialog
    - progressBar
    - popupwindow
    - lombok
---

### Toast：

-   普通 Toast

```java
Toast.makeText(getApplicationContext(), "Toast", Toast.LENGTH_SHORT).show();
```

-   自定义定义显示位置

```java
Toast toast=Toast.makeText(this, "居中Toast", Toast.LENGTH_SHORT);
//参1显示位置，参2,3分别是xy轴的偏移量
toast.setGravity(Gravity.CENTER,0,0);
toast.show();
```

-   自定义样式(布局文件根布局设置大小不管用)
    布局文件：

```html
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
>
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:gravity="center"
    >
        <ImageView
            android:src="@drawable/ic_launcher_background"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
        />
        <TextView
            android:id="@+id/text"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="test"
        />
    </LinearLayout>
</LinearLayout>
```

java 中：

```java
//先写一个布局，然后通过layoutinflater实例为view
LayoutInflater li=LayoutInflater.from(TestActivity.this);
View view=li.inflate(R.layout.toast,null);
//取出组件单独设置
TextView textView=view.findViewById(R.id.text);
textView.setText("自定义Toast");
Toast toast=new Toast(this);
toast.setView(view);//设置视图
toast.setDuration(Toast.LENGTH_SHORT);//设置时间
toast.show();
```

### AlertDialog：

-   基本使用：

```java
//Builder是一种设计模式
AlertDialog.Builder dialog=new AlertDialog.Builder(this);
//所有设置都是可选的
dialog.setIcon(R.drawable.ic_launcher_background)
.setTitle("标题").setMessage("内容")
.setPositiveButton("确定按钮", new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
        Toast.makeText(TestActivity.this, "确定按钮被按下", Toast.LENGTH_SHORT).show();
    }
})
.setNegativeButton("取消按钮", new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
        Toast.makeText(TestActivity.this, "取消按钮被按下", Toast.LENGTH_SHORT).show();
    }
})
.setNeutralButton("其它", new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
        Toast.makeText(TestActivity.this, "其它按钮被按下", Toast.LENGTH_SHORT).show();
    }
});
dialog.create(); 
// 显示对话框并返回AlertDialog对象
AlertDialog ad=dialog.show();
ad.dismiss();//利用AlertDialog对象调用对话框消失方法
```

-   列表形式：

```java
final String[] texts=new String[]{"男","女"};
AlertDialog.Builder dialog2=new AlertDialog.Builder(this);
//参1显示的数组列表，参2点击事件
dialog2.setTitle("请选择").setItems(texts, new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
        Toast.makeText(TestActivity.this, texts[which], Toast.LENGTH_SHORT).show();
    }
})
.create().show();
```

-   单选框形式：

```java
final String[] texts2=new String[]{"男","女"};
AlertDialog.Builder dialog4=new AlertDialog.Builder(this);
//参1显示的数组列表，参2默认选中项，参3点击事件
dialog4.setTitle("请选择").setSingleChoiceItems(texts2, 0, new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
        Toast.makeText(TestActivity.this, texts2[which], Toast.LENGTH_SHORT).show();
        dialog.dismiss();//对话框消失
    }
}).setCancelable(false);//点击对话框外范围，不会自动消失
dialog4.create().show();
break;
```

-   多选框形式：

```java
final String[] texts3=new String[]{"一","二","三"};
final boolean[] checkde=new boolean[]{true,false,true};
AlertDialog.Builder dialog3=new AlertDialog.Builder(this);
//参1显示的数组列表，参2默认选中项，点击事件
dialog3.setTitle("请选择").setMultiChoiceItems(texts3, checkde, new DialogInterface.OnMultiChoiceClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which, boolean isChecked) {
        Toast.makeText(TestActivity.this, texts3[which]+":"+isChecked, Toast.LENGTH_SHORT).show();
    }
}).setPositiveButton("确定", new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialog, int which) {
    }
})
.create().show();
```

-   自定义(与 toast 自定义类似):

```java
//先写一个布局，然后通过layoutinflater实例为view
LayoutInflater li=LayoutInflater.from(TestActivity.this);
View view=li.inflate(R.layout.toast,null);
//取出组件设置
TextView textView=view.findViewById(R.id.text);
textView.setText("自定义Toast");

AlertDialog.Builder dialog3=new AlertDialog.Builder(this);
//参1显示的数组列表，参2默认选中项，点击事件
dialog3.setTitle("自定义")
.setView(view).create().show();
```

### ProgressBar：

-   xml 中：

```html
<ProgressBar
    android:id="@+id/bar1"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
/>
<ProgressBar
    android:id="@+id/bar2"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    style="@android:style/Widget.Material.ProgressBar.Horizontal"
    android:max="100"
    android:progress="30"
/>
```

-   java 中：

```java
//onCreate方法中：
bar2=findViewById(R.id.bar2);
System.out.println(bar2.getProgress());
//模拟进度加载
handler.sendEmptyMessage(0);
-----------------------------------------
// 类中：
Handler handler=new Handler(){
    @Override
    public void handleMessage(@NonNull Message msg) {
        super.handleMessage(msg);
        if (bar2.getProgress()<100){
            this.postDelayed(runnable,500);
        }else{
            Toast.makeText(TestActivity.this, "完成", Toast.LENGTH_SHORT).show();
        }
    }
};
Runnable runnable=new Runnable() {
    @Override
    public void run() {
        //获取进度和设置进度
        bar2.setProgress(bar2.getProgress()+3);
        handler.sendEmptyMessage(0);
    }
};
```

### PopupWindow：

自定义一个弹出菜单：

```java
//实例化一个布局，作为之后的菜单样式
View view= LayoutInflater.from(FriendActivity.this).inflate(R.layout.fun_popup,null);
//初始化，参1为具体菜单样式的实例化对象，参23为菜单的宽高
PopupWindow pop=new PopupWindow(view, ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT);
//想PopupWindow点击外侧时消失需要设置一个背景，才能成功
pop.setBackgroundDrawable(new BitmapDrawable());
pop.setFocusable(true);//获取焦点
pop.setOutsideTouchable(true);//点击外侧消失
//设置位置，参1表示显示在哪个组件下，参23表示偏移值
pop.showAsDropDown(item,0,-30);
```

### AndroidStudio 使用 lombok：

在build.gradle中添加如下配置：

```xml
dependencies {
    annotationProcessor 'org.projectlombok:lombok:1.18.12'
    compileOnly "org.projectlombok:lombok:1.18.12"
}
```

### 解决弹出键盘导致布局改变：

在 onCreate 中的 setContentView 之前添加如下代码：

```java
getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
```