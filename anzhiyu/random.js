var posts=["2020/05/15/android/RecyclerView/","2020/07/06/android/data/","2020/07/04/android/ViewPager/","2020/05/31/android/view/","2020/05/17/android/webview/","2020/06/05/html/jquery/","2020/05/25/html/axios/","2023/04/20/interest/Arduino/","2023/04/01/interest/Linux/","2020/05/14/interest/MarkDown/","2023/04/15/interest/Termux/","2023/03/02/interest/wsl/","2023/04/02/interest/云原生/","2020/06/27/python/python/","2020/05/30/java/JDBC/","2020/06/18/java/jc/","2020/05/17/java/maven/","2020/07/06/sql/sql/","2022/07/09/vue/TypeScript/","2021/08/27/vue/vue/","2021/08/30/vue/vue与ElementUI/","2020/05/14/java/collection/collection/","2020/06/02/java/collection/set/","2020/05/15/java/collection/list/","2020/06/02/java/collection/map/","2022/02/12/vue/vue3/","2021/01/12/java/crawler/HttpClient/","2021/01/17/java/crawler/Jsoup/","2021/01/10/java/crawler/POI/","2020/07/03/java/io/file/","2020/05/21/java/javaweb/filter/","2020/05/19/java/javaweb/jsp/","2020/05/18/java/javaweb/servlet/","2020/06/29/java/jvm/index/","2023/04/29/java/springboot/SpringSecurity/","2020/08/29/java/springboot/SpringBoot/","2023/04/29/java/springboot/mybatisplus/","2020/06/13/java/thread/thread/","2020/10/06/java/ssm/ssm/","2020/08/11/java/ssm/mybatis/advanced/","2020/08/07/java/ssm/mybatis/config/","2021/09/06/java/javaweb/ssh/struts2速览/","2020/07/17/java/ssm/mybatis/index/","2020/08/16/java/ssm/spring/aop/","2020/08/14/java/ssm/spring/index/","2020/08/18/java/ssm/spring/sm/","2020/08/22/java/ssm/springMVC/date/","2020/08/19/java/ssm/springMVC/index/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };