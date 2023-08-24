---
title: Fragment 与 ViewPager
date: 2020-07-04 13:20:20
categories: Android
tags: 
    - fragment
    - viewpager
    - tabLayout
---

### Fragment 与 ViewPager

#### Fragment：

1. 创建一个 Fragment：

```java
public class MyFragment extends Fragment {//继承Fragment
    @Override//拿到上下文
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
    }
    @Nullable
    @Override//指定视图文件
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        //R.layout.fragement为你创建的Fragment的布局文件
        View view=inflater.inflate(R.layout.fragement,container,false);
        return view;
    }
    @Override//对组件做操作
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        TextView textView=view.findViewById(R.id.text);
        textView.setText("--MyFragment2--");
    }
}
```

2. 在 Activity 中的添加 Fragment：

Activity 的布局文件中添加存放组件：

```xml
<FrameLayout
    android:id="@+id/framelayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

在 Activity 中向 `FrameLayout` 添加 Fragment：

```java
MyFragment fg= new MyFragment();//实例化Fragment类
//add方法向FrameLayout添加了MyFragment
getSupportFragmentManager().beginTransaction()
    .add(R.id.framelayout,fg).commitAllowingStateLoss();
```

Android 还提供了隐藏和显示 Fragment 的方法,如下方法能切换 fg1 和 fg2 两 Fragment：

```java
//hide和show分别为隐藏和显示的方法
if (fg1.isHidden()){
    getSupportFragmentManager().beginTransaction()
        .hide(fg2).show(fg1).commitAllowingStateLoss();
} else {
    getSupportFragmentManager().beginTransaction()
        .hide(fg1).show(fg2).commitAllowingStateLoss();
}
```

#### ViewPager：

* 布局文件中添加：

```xml
<androidx.viewpager.widget.ViewPager
    android:id="@+id/viewpager"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

* Activity 中：

```java
// 准备Fragment
MyFragment fg1= new MyFragment();
MyFragment fg2= new MyFragment();
MyFragment fg3= new MyFragment();
ArrayList<Fragment> fragments=new ArrayList<>();
fragments.add(fg1);
fragments.add(fg2);
fragments.add(fg3);
ViewPager viewPager=findViewById(R.id.viewpager);//获取ViewPager
// 设置Adapter
viewPager.setAdapter(new MyPagerAdapter(getSupportFragmentManager(),fragments));
// 显示指定页面
viewPager.setCurrentItem(1);
```

* Adapter 中：

```java
public class MyPagerAdapter extends FragmentPagerAdapter {
    ArrayList<Fragment> fragments;
    public MyPagerAdapter(@NonNull FragmentManager fm,ArrayList<Fragment> fragments) {
        super(fm);
        this.fragments=fragments;
    }
    @NonNull
    @Override
    public Fragment getItem(int position) {
        return fragments.get(position);
    }
    @Override
    public int getCount() {
        return fragments.size();
    }
}
```

#### TabLayout：联合ViewPager实现标签页

xml中：`ViewPager` 内嵌入 `TabLayout`

```xml
<androidx.viewpager.widget.ViewPager
    ···
    <com.google.android.material.tabs.TabLayout
        ··· />
</androidx.viewpager.widget.ViewPager>
```

FragmentPagerAdapter类中：重写 `getPageTitle` 方法

```java
@Nullable
@Override
public CharSequence getPageTitle(int position) {
    return titles[position]; // 返回标题
}
```