---
title: SpringSecurity
date: 2023-04-29 10:10:14
categories: SpringBoot
tags: 
    - springsecurity
    - springboot
    - jwt
---

# SpringSecurity

## 初识

### 认证流程

* 过滤器链与查看方式：

![过滤器链与查看方法](/images/java/springboot/SpringSecurity/DefaultSecurityFilterChain.png)

* 认证流程：

![认证流程](/images/java/springboot/SpringSecurity/Process.jpg)

### 准备工作

#### 1. 必要依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- https://github.com/jwtk/jjwt#install -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

* SpringSecurity 依赖添加以后会发现访问 controller 接口会自动跳转到 `/login` 接口弹出一个登录页面登录后才能进行访问，登录名称默认为 **user** 密码则被打印在了控制台中
* 也可已通过配置文件指定用户名和密码：

```yaml
spring:
  security:
    user:
      name: user
      password: 123456
```

#### 2. Redis 配置：

##### Redis 序列化配置：

```java
import com.alibaba.fastjson.parser.ParserConfig;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    @ConditionalOnSingleCandidate
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 使用 fastJSON 作为 value 序列化器，并启用 autoType 特性
        FastJsonRedisSerializer serializer = new FastJsonRedisSerializer(Object.class);
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
        serializer.setFastJsonConfig(new FastJsonConfig());

        // 使用 StringRedisSerializer 来序列化和反序列化 redis 的 key 值
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);

        // Hash 的 key 也采用 StringRedisSerializer 的序列化方式
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

IDE 没有正确识别 `RedisConnectionFactory` 类型的参数，导致参数报红报错。但是实际上 SpringBoot 在运行时会自动注入到 redisTemplate 方法中，因此在实际使用时并不会出现问题。

* 方法上的 `@ConditionalOnSingleCandidate` 会检查容器中是否存在 RedisConnectionFactory 类型的 Bean，如果存在且只有一个，则会创建 RedisTemplate Bean。

##### Redis 缓存工具类：

```java
@Component
public class RedisCache {
    @Autowired
    public RedisTemplate redisTemplate;

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key   缓存的键值
     * @param value 缓存的值
     */
    public <T> void setCacheObject(final String key, final T value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key      缓存的键值
     * @param value    缓存的值
     * @param timeout  时间
     * @param timeUnit 时间颗粒度
     */
    public <T> void setCacheObject(final String key, final T value, final Integer timeout, final TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout) {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @param unit    时间单位
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获得缓存的基本对象。
     *
     * @param key 缓存键值
     * @return 缓存键值对应的数据
     */
    public <T> T getCacheObject(final String key) {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }

    /**
     * 删除单个对象
     *
     * @param key
     */
    public boolean deleteObject(final String key) {
        return redisTemplate.delete(key);
    }

    /**
     * 删除集合对象
     *
     * @param collection 多个对象
     * @return
     */
    public long deleteObject(final Collection collection) {
        return redisTemplate.delete(collection);
    }

    /**
     * 缓存List数据
     *
     * @param key      缓存的键值
     * @param dataList 待缓存的List数据
     * @return 缓存的对象
     */
    public <T> long setCacheList(final String key, final List<T> dataList) {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }

    /**
     * 获得缓存的list对象
     *
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    public <T> List<T> getCacheList(final String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    /**
     * 缓存Set
     *
     * @param key     缓存键值
     * @param dataSet 缓存的数据
     * @return 缓存数据的对象
     */
    public <T> BoundSetOperations<String, T> setCacheSet(final String key, final Set<T> dataSet) {
        BoundSetOperations<String, T> setOperation = redisTemplate.boundSetOps(key);
        Iterator<T> it = dataSet.iterator();
        while (it.hasNext()) {
            setOperation.add(it.next());
        }
        return setOperation;
    }

    /**
     * 获得缓存的set
     *
     * @param key
     * @return
     */
    public <T> Set<T> getCacheSet(final String key) {
        return redisTemplate.opsForSet().members(key);
    }

    /**
     * 缓存Map
     *
     * @param key
     * @param dataMap
     */
    public <T> void setCacheMap(final String key, final Map<String, T> dataMap) {
        if (dataMap != null) {
            redisTemplate.opsForHash().putAll(key, dataMap);
        }
    }

    /**
     * 获得缓存的Map
     *
     * @param key
     * @return
     */
    public <T> Map<String, T> getCacheMap(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key   Redis键
     * @param hKey  Hash键
     * @param value 值
     */
    public <T> void setCacheMapValue(final String key, final String hKey, final T value) {
        redisTemplate.opsForHash().put(key, hKey, value);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key  Redis键
     * @param hKey Hash键
     * @return Hash中的对象
     */
    public <T> T getCacheMapValue(final String key, final String hKey) {
        HashOperations<String, String, T> opsForHash = redisTemplate.opsForHash();
        return opsForHash.get(key, hKey);
    }

    /**
     * 删除Hash中的数据
     *
     * @param key
     * @param hkey
     */
    public void delCacheMapValue(final String key, final String hkey) {
        HashOperations hashOperations = redisTemplate.opsForHash();
        hashOperations.delete(key, hkey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeys Hash键集合
     * @return Hash对象集合
     */
    public <T> List<T> getMultiCacheMapValue(final String key, final Collection<Object> hKeys) {
        return redisTemplate.opsForHash().multiGet(key, hKeys);
    }

    /**
     * 获得缓存的基本对象列表
     *
     * @param pattern 字符串前缀
     * @return 对象列表
     */
    public Collection<String> keys(final String pattern) {
        return redisTemplate.keys(pattern);
    }
}
```

#### 3. 统一响应体：

* 响应结果枚举

```java
@Getter
@AllArgsConstructor
public enum ResultEnum {
    SUCCESS(200, "成功"),
    FAIL(500, "失败"),
    BAD_REQUEST(400, "请求错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),
    GATEWAY_TIMEOUT(504, "网关超时"),
    ;

    private final Integer code;
    private final String msg;
}
```

* 响应类

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RespResult<T> {

    private Integer code;
    private String msg;
    private T data;

    public RespResult(ResultEnum resultEnum) {
        this.code = resultEnum.getCode();
        this.msg = resultEnum.getMsg();
    }

    public RespResult<T> setCode(Integer c) {
        this.code = c;
        return this;
    }

    public RespResult<T> setMsg(String m) {
        this.msg = m;
        return this;
    }

    public RespResult<T> setData(T d) {
        this.data = d;
        return this;
    }

    public RespResult<T> setCodeAndMsg(ResultEnum resultEnum) {
        this.code = resultEnum.getCode();
        this.msg = resultEnum.getMsg();
        return this;
    }

    public RespResult<T> setCodeAndMsg(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
        return this;
    }

    public static <T> RespResult<T> success() {
        return new RespResult<>(ResultEnum.SUCCESS);
    }

    public static <T> RespResult<T> success(String msg) {
        return new RespResult<T>(ResultEnum.SUCCESS)
                .setMsg(msg);
    }

    public static <T> RespResult<T> success(T data) {
        return new RespResult<T>(ResultEnum.SUCCESS)
                .setData(data);
    }

    public static <T> RespResult<T> success(String msg, T data) {
        return new RespResult<T>(ResultEnum.SUCCESS)
                .setMsg(msg).setData(data);
    }

    public static <T> RespResult<T> fail() {
        return new RespResult<>(ResultEnum.FAIL);
    }

    public static <T> RespResult<T> fail(String msg) {
        return new RespResult<T>(ResultEnum.FAIL)
                .setMsg(msg);
    }

    public static <T> RespResult<T> fail(T data) {
        return new RespResult<T>(ResultEnum.FAIL)
                .setData(data);
    }

    public static <T> RespResult<T> fail(String msg, T data) {
        return new RespResult<T>(ResultEnum.FAIL)
                .setMsg(msg).setData(data);
    }

    public static <T> RespResult<T> result() {
        return new RespResult<>();
    }

    public static <T> RespResult<T> result(Integer code) {
        return new RespResult<T>()
                .setCode(code);
    }

    public static <T> RespResult<T> result(String msg) {
        return new RespResult<T>()
                .setMsg(msg);
    }

    public static <T> RespResult<T> result(Integer code, String msg) {
        return new RespResult<T>()
                .setCode(code)
                .setMsg(msg);
    }

    public static <T> RespResult<T> result(Integer code, String msg, T data) {
        return new RespResult<T>()
                .setCode(code)
                .setMsg(msg)
                .setData(data);
    }

    public static <T> RespResult<T> enumResult(ResultEnum resultEnum) {
        return new RespResult<>(resultEnum);
    }

    public static <T> RespResult<T> enumResult(ResultEnum resultEnum, T data) {
        return new RespResult<T>(resultEnum)
                .setData(data);
    }
}
```

* 响应数据工具类：

```java
public class WebUtils {
    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
     * @param string   待渲染的字符串
     * @return null
     */
    public static String renderString(HttpServletResponse response, String string) {
        try {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(string);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

#### 4. JWT 工具类：

```java
public class JwtUtil {
    public static final Long JWT_TTL = 60 * 60 * 1000L; // 一个小时
    public static final String JWT_ISSUER = "ruoxijun";
    public static final String JWT_KEY = "ruoxijun+ruoxijun+ruoxijun+ruoxijun+ruoxijun+ruoxijun";

    public static String createJWT(String subject) {
        JwtBuilder builder = getJwtBuilder(subject, null, getUUID());
        return builder.compact();
    }

    public static String createJWT(String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, getUUID());
        return builder.compact();
    }

    public static String createJWT(String id, String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, id);
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillis, String uuid) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        SecretKey secretKey = generalKey();
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        if (ttlMillis == null) {
            ttlMillis = JwtUtil.JWT_TTL;
        }
        long expMillis = nowMillis + ttlMillis;
        Date expDate = new Date(expMillis);
        return Jwts.builder()
                .setId(uuid) //唯一的ID
                .setSubject(subject) // 主题可以是JSON数据
                .setIssuer(JWT_ISSUER) // 签发者
                .setIssuedAt(now) // 签发时间
                .signWith(secretKey, signatureAlgorithm) //使用HS256对称加密算法签名, 第二个参数为秘钥
                .setExpiration(expDate);
    }

    public static Claims parseJWT(String jwt) throws Exception {
        SecretKey secretKey = generalKey();
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }

    public static SecretKey generalKey() {
        return Keys.hmacShaKeyFor(JwtUtil.JWT_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public static String getUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
```

### 数据库登录

* 由认证流程可知 SpringSecurity 通过 `UserDetailsService` 的 `loadUserByUsername` 方法查询用户后返回 `UserDetails` 用户信息对象。

#### 1. UserDetails：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUser implements UserDetails {
    private User user;
    @Override
    public String getPassword() { return user.getPassword(); }
    @Override
    public String getUsername() { return user.getUsername(); }

    @Override// 获取权限信息
    public Collection<? extends GrantedAuthority> getAuthorities() { return null; }

    @Override // 是否没有过期
    public boolean isAccountNonExpired() { return true; }
    @Override // 是否未锁定
    public boolean isAccountNonLocked() { return true; }
    @Override // 凭据是否未过期
    public boolean isCredentialsNonExpired() { return true; }
    @Override // 是否可用
    public boolean isEnabled() { return true; }
}
```

#### 2. UserDetailsService：

```java
@Service
public class UserDetailsServiceImp implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);
        if (Objects.isNull(user)){
            throw new RuntimeException("用户名或密码错误");
        }
        
        // todo 查询用户对应权限
        
        return new LoginUser(user);
    }
}
```

* 这时想要使用数据库的用户账号密码登录还需要在用户 **数据库的密码前面** 添加 `{noop}` ，之后就可以使用该账号密码登录了

## JWT 登录

### 登录流程

1. 自定义 `/login` 登录接口，并在 SpringSecurity 配置文件中让它放行
2. 在接口中通过 `AuthenticationManager` 的 `authenticate` 进行用户认证
    * `AuthenticationManager` 需要在配置文件中注入容器
    * `authenticate` 需要一个 `Authentication` 接口对象我们使用 `UsernamePasswordAuthenticationToken` 认证成功会返回这个 `Authentication` 对象否则为 `null`
3. 认证成功后生成 JWT 并存入 Redis ，最后将 JWT（token） 响应给客户端
4. 自定义 JWT 认证过滤器，之后用户携带 token 访问接口时通过解析 token 获取用户信息，并将信息出入 `SecurityContextHolder` 中（仅此次请求有效）
    * 继承 `OncePerRequestFilter` 过滤器确保一次请求仅被调用一次，通常一个请求会经过多个过滤器,如果没有限制一个过滤器可能被调用多次

#### 密码加密处理：

* 在 SpringSecurity 中，如果使用的是 **明文密码** ，则需要在密码前添加 `{noop}` 前缀，这是因为SpringSecurity 默认使用加密密码来保护用户密码

* SpringSecurity 中最常用的是 BCryptPasswordEncoder 使用 bcrypt 哈希算法来加密密码
* 在 SpringSecurity 配置文件中把 `BCryptPasswordEncoder` 注入容器（@Bean），SpringSecurity 则会使用该 PasswordEncoder 进行密码校验

##### BCryptPasswordEncoder 常用方法：

```java
@Autowired
BCryptPasswordEncoder bCryptPasswordEncoder;

@Test
void contextLoads() {
    // BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    String password = "123456";
    // 密码加密
    String encode = bCryptPasswordEncoder.encode(password);
    // 密码校验
    boolean matches = bCryptPasswordEncoder.matches(password, encode);
    System.out.println(encode + " <-=-> " + matches);
}
```

### LoginService

* controller 登录接口 `/login` 和 LoginService 接口类请自行实现，这里是登录业务实现：

```java
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private RedisCache redisCache;

    @Override
    public RespResult login(User user) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                user.getUsername(), user.getPassword()); // 传入用户名和密码
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        if(Objects.isNull(authenticate)){ // 认证未通过
            throw new RuntimeException("用户名或密码错误");
        }
        // 获取 UserDetails 对象，使用 userId 生成 token
        LoginUser loginUser = (LoginUser) authenticate.getPrincipal();
        String userId = loginUser.getUser().getId().toString();
        String jwt = JwtUtil.createJWT(userId);
        // authenticate 存入 redis
        redisCache.setCacheObject("login:"+userId, loginUser);
        // token 响应给前端
        HashMap<String,String> map = new HashMap<>();
        map.put("token",jwt);
        return RespResult.success("登录成功", map);
    }
    
    @Override
    public RespResult logout() {
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        Long userid = loginUser.getUser().getId();
        redisCache.deleteObject("login:" + userid);
        return RespResult.success("注销成功");
    }
}
```

### JwtAuthenticationFilter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private RedisCache redisCache;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 获取 token
        String token = request.getHeader("token");
        if (!StringUtils.hasText(token)) {
            filterChain.doFilter(request, response);
            return;
        }
        // 解析 token
        String userid;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            userid = claims.getSubject();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("token非法");
        }
        // 从 redis 中获取用户信息
        String redisKey = "login:" + userid;
        LoginUser loginUser = redisCache.getCacheObject(redisKey);
        if (Objects.nonNull(loginUser)) {
            // 存入 SecurityContextHolder
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            loginUser, null, loginUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }
}
```

### SecurityConfig

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            // 关闭 csrf
        http.csrf().disable()
                //不通过 Session 获取 SecurityContext
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()
                // 登录接口允许匿名访问，permitAll：允许所有用户访问
                .antMatchers("/login").anonymous()
                // 其他地址的访问均需验证权限
                .anyRequest().authenticated();

            // 把 token 校验过滤器添加到某过滤器之前
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

            // 允许跨域（SpringBoot 也需要同时开启）
        http.cors();
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 密码明文加密方式配置
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // 获取 AuthenticationManager（认证管理器），登录时认证使用
        return authenticationConfiguration.getAuthenticationManager();
    }
}
```

## 访问权限

在 SpringSecurity 中,会使用默认的 `FilterSecurityInterceptor` 过滤器来进行权限校验。它会从`SecurityContextHolder` 中获取当前 `Authentication` ,并获取其中包含的权限信息,以判断当前用户是否有权访问当前资源。

### 准备工作

* 在 SpringSecurity 的配置类 `SecurityConfig` 上添加如下注解：

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
```

它启用方法级的安全约束， `prePostEnabled=true` 表示启用预验证(pre 方法执行前校验)和后验(post 方法执行前校验)拦截器

* 假如给 controller `/hello` 接口方法上方添加如下权限校验注解，它表示执行该方法前它会校验当前用户是否有 admin 权限

```java
@PreAuthorize("hasAuthority('admin')")
```

### 获取权限

#### 1. UserDetails

```java
@Data
@NoArgsConstructor
public class LoginUser implements UserDetails {
    private User user;

    private List<String> permissions;

    @JSONField(serialize = false)
    private List<SimpleGrantedAuthority> authorities;

    public LoginUser(User user, List<String> permissions){
        this.user = user;
        this.permissions = permissions;
    }

    @Override
    public String getPassword() { return user.getPassword(); }

    @Override
    public String getUsername() { return user.getUsername(); }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (Objects.nonNull(authorities)) {
            return authorities;
        }
        authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        return authorities;
    }

    @Override // 是否没有过期
    public boolean isAccountNonExpired() { return true; }

    @Override // 是否未锁定
    public boolean isAccountNonLocked() { return true; }

    @Override // 凭据是否未过期
    public boolean isCredentialsNonExpired() { return true; }

    @Override // 是否可用
    public boolean isEnabled() { return true; }
}
```

#### 2. UserDetailsService

```java
@Service
public class UserDetailsServiceImp implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);
        if (Objects.isNull(user)){
            throw new RuntimeException("用户名或密码错误");
        }
        // 将用户对象与用户权限封装到 UserDetails 中
        // 此处权限应是用户数据库中查询到的权限
        LoginUser loginUser = new LoginUser(user, Arrays.asList("admin"));
        return loginUser;
    }
}
```

### 其它校验

#### 校验方法：

```java
@PreAuthorize("hasAuthority('admin')") // 校验某个权限
@PreAuthorize("hasAnyAuthority('admin', 'admin2')") // 校验多个权限

// 与上类似但会自动在权限名前添加 ROLE_ 的前缀
@PreAuthorize("hasRole('admin2')")
@PreAuthorize("hasAnyRole('admin', 'admin2')")
```

#### 自定义校验：

* 定义一个自定义校验方法的通用接口：

```java
public interface PermissionService {
    boolean checkPermission(String authority);
}
```

* 实现校验接口与校验方法：

```java
@Service("psi")
public class PermissionServiceImpl implements PermissionService {
    public boolean checkPermission(String authority) {
        // 获取用户权限
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<String> permissions = loginUser.getPermissions();
        // 校验权限
        return permissions.contains(authority);
    }
}
```

* 使用校验方法:

```java
// @psi 表示 bean 在容器中的名称加上 @ 前缀
@PreAuthorize("@psi.checkPermission('admin')")
```

#### 配置校验：

```java
http.authorizeRequests()
    .antMatchers("/login").anonymous()
    // 需要 admin 权限才能访问 /hello 接口
    .antMatchers("/hello").hasAuthority("admin")
    .anyRequest().authenticated();
```

1. 如果配置和注解包含相同接口，先会校验配置类中的权限再校验注解的权限
2. 配置中的权限校验发生授权异常时不会被全局异常处理器捕获，而是被授权异常处理器捕获。而到校验注解方式授权异常时会被全局异常捕获

## 异常处理

### 认证异常

* 在认证过程中出现的异常会被封装成 `AuthenticationException` 然后调用 **AuthenticationEntryPoint** 对象的方法去进行异常处理

```java
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) {
        RespResult<Object> respResult = RespResult.result(
                HttpStatus.UNAUTHORIZED.value(), "身份认证失败");
        String json = JSON.toJSONString(respResult);
        WebUtils.renderString(response,json);
    }
}
```

### 授权异常

* 授权过程中出现的异常会被封装成 `AccessDeniedException` 然后调用 **AccessDeniedHandler** 对象的方法去进行异常处理

```java
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) {
        RespResult<Object> respResult = RespResult.result(
                HttpStatus.FORBIDDEN.value(), "用户权限不足");
        String json = JSON.toJSONString(respResult);
        WebUtils.renderString(response, json);
    }
}
```

### 添加配置

* 在 SecurityConfig 中获取认证与授权异常处理器：

```java
@Autowired
AuthenticationEntryPoint authenticationEntryPoint;

@Autowired
AccessDeniedHandler accessDeniedHandler;
```

* 增加如下配置：

```java
http.exceptionHandling()
    // 认证异常处理
    .authenticationEntryPoint(authenticationEntryPoint)
    // 授权异常处理
    .accessDeniedHandler(accessDeniedHandler);
```

### 全局异常

如果配置了 `@ControllerAdvice` 全局异常处理，其中处理的异常范围若包括了 `AccessDeniedException` 那么 **注解权限** 授权异常将被它拦截 SpringSecurity 不再处理，因此我们需要在全局异常中处理注解校验的授权异常。

```java
@ResponseBody
@ControllerAdvice
public class GlobalExceptionHandler {
    // SpringSecurity 授权异常处理
    @ExceptionHandler(AccessDeniedException.class)
    public RespResult<String> handlerAccessDeniedException(Exception e) {
        return RespResult.result(HttpStatus.FORBIDDEN.value(), "权限不足");
    }

    // 全局异常处理
    @ExceptionHandler(Exception.class)
    public RespResult<String> handlerException(Exception e) {
        return RespResult.fail("程序异常", e.getMessage());
    }
}
```

## 其它处理器

### 认证成功

```java
@Component
public class SGSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        System.out.println("认证成功了");
    }
}
```

### 认证失败

```java
@Component
public class SGFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) {
        System.out.println("认证失败了");
    }
}
```

### 登出成功

```java
@Component
public class SGLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        System.out.println("注销成功");
    }
}
```

### 载入配置

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    AuthenticationSuccessHandler successHandler;
    @Autowired
    AuthenticationFailureHandler failureHandler;
    @Autowired
    LogoutSuccessHandler logoutSuccessHandler;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.formLogin()
                // 认证成功处理器
                .successHandler(successHandler)
                // 认证失败处理器
                .failureHandler(failureHandler);

        http.logout()
                // 注销成功处理器
                .logoutSuccessHandler(logoutSuccessHandler);

        http.authorizeRequests()
                .anyRequest().authenticated();
        return http.build();
    }
}
```























