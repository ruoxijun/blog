---
title: RecyclerView
date: 2020-05-15 19:33:05
categories: Android
tags: 
    - pecyclerView
    - scrollView
---

### RecyclerView

> #### 做一个简单的 recycler

##### 1. 添加 RecyclerView 的依赖项

我们需要先在 APP 的 **build.gradle** 文件中添加下面的代码，让配置文件将需要的库加载进来。[请参考此网页,以获取最新的配置代码](https://developer.android.google.cn/jetpack/androidx/releases/recyclerview?hl=zh_cn)

```java
dependencies {
        implementation "androidx.recyclerview:recyclerview:1.1.0"
        implementation "androidx.recyclerview:recyclerview-selection:1.1.0-rc01"
    }
```

##### 2. 在 xml 使用且在 activity 中获取并设置 recyclerview

-   xml 中：

```xml
<androidx.recyclerview.widget.RecyclerView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/recycler" />
```

-   activity 中：

```java
//获取组件，常规步骤
recyclerView = findViewById(R.id.recycler);
/**
 * RecyclerView.LayoutManager:抽象类主要用于Item布局效果，自带的实现类有：
 * LinearLayoutManager、StaggeredGridLayoutManager、GridLayoutManager。
 */
//这里是设置布局,我们先使用最简单的线性布局
recyclerView.setLayoutManager(new LinearLayoutManager(this));
//需要一个适配器
recyclerView.setAdapter(new LinearAdapter(this));
```

此时我们做完这些是看不到效果的。我们还需要写一个适配器。

#### 3.适配器 RecyclerView.Adapter

开始之前我们看一下适配器部分源码：

```java
public static abstract class Adapter<VH extends ViewHolder> {
      public abstract VH onCreateViewHolder(ViewGroup parent, int viewType);
      public abstract void onBindViewHolder(VH holder, int position);
      public abstract int getItemCount();
}
```

从源码得知，我们有 3 个必须要实现的方法。且它有规定一个只接受 ViewHolder 子类的泛型，方法 1 返回该类，方法 2 需要该类的传入。

```java
//RecyclerView的适配器必须继承RecyclerView.Adapter
class LinearAdapter extends RecyclerView.Adapter<LinearAdapter.LinearHolder> {
    private Context context;

    /**适配器构造方法：
     * 构造方法可以自己决定，一般传入需要用到的数据。
     */
    public LinearAdapter(Context context) {
        this.context = context;
    }

    /**onCreateViewHolder创建ViewHolder，
     * 该方法会在RecyclerView需要展示一个item的时候回调。
     * 重写该方法时，应该使ViewHolder载入item view的布局
     */
    public LinearAdapter.LinearHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        //from(parent.getContext())可以不用构造方法传参
        return new LinearHolder(LayoutInflater.from(context)
                .inflate(R.layout.item,parent,false));
        //inflate将布局实例化为了一个view传入
    }

    /**onBindViewHolder
     * 给item设置数据，把数据绑定、填充到相应的item中
     */
    public void onBindViewHolder(@NonNull LinearAdapter.LinearHolder holder, int position) {
        holder.textView.setText("Item");
        holder.imageView.setImageResource(R.drawable.ic_launcher_background);
    }

    //设置item的数量
    public int getItemCount() {
        return 10;
    }

    /**ViewHolder没有必要再写一个java文件来实现它，
     * 直接使用内部类继承RecyclerView的内部类ViewHolder即可，
     * 上方方法调用时也更方便
     */
    class LinearHolder extends RecyclerView.ViewHolder{
        private ImageView imageView;
        private TextView textView;
        //这里通常写上需要改变的组件
        public LinearHolder(@NonNull View itemView) {
            super(itemView);
            //这里itemview是item的布局文件，通过它获取组件
            textView = itemView.findViewById(R.id.textView);
            imageView = itemView.findViewById(R.id.imageView);
        }
    }
}
```

这样一个简单的 RecyclerView 就完成了。

#### 4. addItemDecoration 添加分割线

> RecyclerView.ItemDecoration:抽象类，主要用于给 Item 之间添加分割线。官方没有实现类，所以如果要添加分割线，我们需要手动实现这个抽象类。这里使用的 **_getItemOffsets_** 方法添加，并不是真正的添加了分隔线而是利用给 item 之间 **增加间隔** ，让下面的 **背景** 漏出而产生的分割线。

```java
recyclerView.addItemDecoration(new MyDecoration());
---------------------------------------------------------
//此内部类写在类中并继承RecyclerView.ItemDecoration
class MyDecoration extends RecyclerView.ItemDecoration{
    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        super.getItemOffsets(outRect, view, parent, state);
        //在下出现1dp间隔(下划线)
        outRect.bottom=1;
    }
}
```

#### 5.事件

-   最简单的方法：在 onBindViewHolder 中，利用 holder 直接给组件添加事件即可。

```java
public void onBindViewHolder(@NonNull LinearAdapter.LinearHolder holder, final int position) {
    holder.imageView.setOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
            Toast.makeText(context, position+"b被点击", Toast.LENGTH_SHORT).show();
        }
    });
}
```

-   事件回调方法：这样自由度更高，扩展性更高。
    > -   在适配器类中定义一个接口和该接口对象，在接口中定义事件方法
    > -   构造适配器对象时，可接受一个该接口对象。
    > -   且在 onBindViewHolder 中给组件设置事件时方法中可以是具体内容也可以利用该接口对象使用该方法。

### [以上具体代码汇总参考地址](http://note.youdao.com/noteshare?id=e46eb0aa308a609cffd6cabb5a98396e&sub=F07A2A91AF474B74A4D0F3A435019B9D)

#### 进阶与扩展

-   设置水平列表：

```java
//之前我们设置的布局，默认垂直
LinearLayoutManager layout = new LinearLayoutManager(this);
//设置为水平方向
layout.setOrientation(RecyclerView.HORIZONTAL);
recyclerHor.setLayoutManager(layout);
```

-   网格布局：

```java
//获取网格布局管理器，参1上下文参数，参2表示一行有几列
GridLayoutManager grid=new GridLayoutManager(this,4);
recyclerGrid.setLayoutManager(grid);
//recyclerGrid.setLayoutManager(new GridLayoutManager(this,4););//效果同上
recyclerGrid.setAdapter(new GridAdapter());
```

-   瀑布流布局：

```java
//获取瀑布流网格布局，参2是方向还可以是水平
StaggeredGridLayoutManager stagger=new
        StaggeredGridLayoutManager(2,StaggeredGridLayoutManager.VERTICAL);
recyclerStagger.setLayoutManager(stagger);
```

-   item 的增删改与移动：(传入的参数都是指定的位置 position)

```java
//添加RecyclerView中的item组件
list.add(list.size()+"新");
//在指定位置添加item，并通知此item(单个)刷新(推荐使用)
recyclerAdapter.notifyItemInserted(list.size()-1);
//recyclerAdapter.notifyDataSetChanged();//全部刷新

//删除RecyclerView中的item组件
int i = new Random().nextInt(list.size());
list.remove(i);
recyclerAdapter.notifyItemRemoved(i);//移除某item并刷新

//更改RecyclerView组件中的item
int i = new Random().nextInt(list.size());
list.set(i,i+"改");
recyclerAdapter.notifyItemChanged(i);//更改某item

//移动RecyclerView组件中的item
int start = new Random().nextInt(list.size());
int end = new Random().nextInt(list.size());
//将start位置上的item移动到end位置去，end上和之后的组件后移
recyclerAdapter.notifyItemMoved(start,end);
```

* 根据需要不同的view使用不同的布局
```java
//设置视图值(重写该方法，根据需要返回不同的值)
public int getItemViewType(int position) {
    if (position%2==0){return 0;}
    return 1;
}

public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
    if (viewType==0)//根据不同的样式值设置不同的布局样式
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item,parent,false));
    return new ImgViewHolder(LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_stagger,parent,false));
}

public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
    if (getItemViewType(position)==0) {//利用上方改写的方法，根据坐标获取样式值
        ((ViewHolder) holder).textView.setText("Demo " + position);
        ((ViewHolder) holder).imageView.setImageResource(R.drawable.ic_launcher_background);
    }
}

//设置两个不同的Holder(创建两个item.xml布局文件)
class ViewHolder extends RecyclerView.ViewHolder{
    private TextView textView;
    private ImageView imageView;
    public ViewHolder(@NonNull View itemView) {
        super(itemView);
        textView = itemView.findViewById(R.id.textView);
        imageView = itemView.findViewById(R.id.imageView);
    }
}
class ImgViewHolder extends RecyclerView.ViewHolder{
        private ImageView imageView;
    public ImgViewHolder(@NonNull View itemView) {
        super(itemView);
        imageView = itemView.findViewById(R.id.imageView);
    }
}
```

### RecyclerView和ScrollView协同使用：

* RecyclerView会自动获取焦点，导致打开页面时RecyclerView之上的控件被RecyclerView挤出屏幕外。在RecyclerView的外部布局中加入如下配置，表示viewgroup会覆盖子类控件而直接获得焦点。

```xml
android:descendantFocusability="blocksDescendants"
```

* RecyclerView和ScrollView 一起用，滑动会不流畅，因为两个都有滑动事件，设置下:

```java
recyclerView.setNestedScrollingEnabled(false);
```

* RecyclerView和ScrollView 一起用，偶尔出现数据条目显示不全这是RecyclerView获取布局高度不准确导致，建议使用相等布局将其包裹：

```xml
<RelativeLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content">
    <androidx.recyclerview.widget.RecyclerView
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
</RelativeLayout>
```

