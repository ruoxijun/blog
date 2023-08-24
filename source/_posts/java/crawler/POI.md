---
title: POI 与 easyExcel
date: 2021-01-10 16:31:14
categories: Java
tags: 
    - 爬虫
    - poi
    - easyexcel
---

# POI 与 easyExcel 操作 Excel

> *   Apache POI是Apache软件基金会的开放源码函式库，POI提供API给Java程序对Microsoft Office格式档案读和写的功能。
>
> *   EasyExcel是一个基于Java的简单、省内存的读写Excel的阿里巴巴开源项目。在尽可能节约内存的情况下支持读写百M的Excel。

## POI结构：

   -   HSSF ： 提供读写Microsoft Excel格式档案的功能（2003）。
   -   XSSF ： 提供读写Microsoft Excel OOXML格式档案的功能（2007）。
   -   HWPF ： 提供读写Microsoft Word格式档案的功能。
   -   HSLF ： 提供读写Microsoft PowerPoint格式档案的功能。
   -   HDGF ： 提供读写Microsoft Visio格式档案的功能。

## POI依赖：

```xml
<dependencies>
    <!-- excel03版xls，最多65536格 -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi</artifactId>
        <version>4.1.2</version>
    </dependency>

    <!-- excel07版xlsx -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>4.1.2</version>
    </dependency>
</dependencies>
```

## POI 写入 excel：

### HSSFWorkbook(03)：

```java
/* poi 对excel03版进行写入操作 */
// 1. 创建工作簿
Workbook workBook = new HSSFWorkbook();
// 2. 在工作簿中创建一个工作表，sheet1作为表名
Sheet sheet = workBook.createSheet("sheet1");
// 3. 表中创建首行对象(注意03版最大行数为65536行，超出此行报错)
Row row1 = sheet.createRow(0);
// 4. 创建首个单元格对象
Cell cell1 = row1.createCell(0);
// 5. 对单元格执行写入操作
cell1.setCellValue("(1,1)单元格");

// 创建excel文件对象
String path = "E:\\myfile\\IDEA\\demo";
String fileName = "excelTest.xls"; // 注意03版文件结尾为 xls
FileOutputStream excelFile = new FileOutputStream(new File(path,fileName));
// 利用工作簿对象将文件写出
workBook.write(excelFile);
// 关闭流对象
excelFile.close();
```

### XSSFWorkbook(07)：

03与07只存在工作簿对象和文件后缀的不同，并不太大的改变。因为面向对象编程的好处我们只需修改接口对象与文件的后缀为xlsx即可完成03至07的转变。需改变内容如下：

```java
// 创建工作簿使用XSSFWorkbook对象
Workbook workBook = new XSSFWorkbook();
// 修改文件后缀
String fileName = "excelTest.xlsx"; // 注意07版文件结尾为 xlsx
```

### SXSSFWorkbook(07快速写入)：

由上可发现 `HSSFWorkbook` 操作速度快但数量受限， `XSSFWorkbook` 数量没有限制但效力极低。

官方提供了另一个类 `SXSSFWorkbook` 来解决效率低的问题，它利用临时文件来存储数据。默认内存中最多保存100条数据超过时将前100条数据将写入临时文件中，也可在构造函数中传入自定义缓存数量。

**注意：** 产生的临时文件需要清理（dispose）。

```java
// 使用SXSSFWorkbook创建工作簿对象
Workbook workBook = new SXSSFWorkbook();
Sheet sheet1 = workBook.createSheet();
// 写入65536行数据
for (int i = 0; i <65536 ; i++) {
    Row row = sheet1.createRow(i);
    for (int j = 0; j < 10; j++) {
        Cell cell = row.createCell(j);
        cell.setCellValue("("+i+","+j+")");
    }
}
String path = "E:\\myfile\\IDEA\\demo";
String fileName = "sxssf.xlsx";
FileOutputStream excelFile = new FileOutputStream(new File(path, fileName));
// 写出文件
workBook.write(excelFile);
// 关闭流
excelFile.close();
// 清除临时文件（SXSSFWorkbook特有方法必须转型）
((SXSSFWorkbook)workBook).dispose();
```

## POI 读取 excel：

##### 案例表格数据如下：（求和单元格公式为 `=B2+C2` ）

| 时间          | 数字 | 小数 | 布尔 | 字符串 | 求和   |
| ------------- | ---- | ---- | ---- | ------ | ------ |
| 2021年6月10日 | 999  | 9.9  | TRUE | 哈哈哈 | 1008.9 |

##### 代码如下：

```java
FileInputStream excelFile = new FileInputStream(new File(path, fileName));
// 获取工作簿文件对象
Workbook workBook = new HSSFWorkbook(excelFile);
// 获取第一个工作表对象
Sheet sheet = workBook.getSheetAt(0);

/* 获取标题行内容 */
// 拿到标题行对象
Row rowTitle = sheet.getRow(0);
if (rowTitle != null) { // 当前行不为空时
    // 获取到当前行数据的个数(中间空单元格不算)
    int cellCount = rowTitle.getPhysicalNumberOfCells();
    for (int cellNum = 0; cellNum < cellCount; cellNum++) {
        Cell cell = rowTitle.getCell(cellNum);
        if (cell != null) { // 当前单元格不为空时
            // 这是在知道标题行数据都是字符串的情况下直接获取的
            String cellValue = cell.getStringCellValue();
            System.out.print(cellValue+" | ");
        }
    }
    System.out.println();
}

/* 获取正式表格中的内容 */
// 拿到当前工作簿的计算对象（公式单元格需要此对象进行计算）
FormulaEvaluator eval = new HSSFFormulaEvaluator((HSSFWorkbook) workBook);
// 获取表中的有数据的行数(空行不算)
int rowCount = sheet.getPhysicalNumberOfRows();
for (int rowNum = 1; rowNum < rowCount; rowNum++) {
    Row row = sheet.getRow(rowNum);
    if (row != null) {
        int cellCount = row.getPhysicalNumberOfCells();
        for (int cellNum = 0; cellNum < cellCount; cellNum++) {
            Cell cell = row.getCell(cellNum);
            if (cell != null) {
                CellType cellType = cell.getCellType();
                String cellValue = "";
                switch (cellType) {
                    case STRING: // 字符串类型
                        System.out.print("【字符串】：");
                        cellValue = cell.getStringCellValue();
                        break;
                    case NUMERIC: // 数值类型（整数、小数、日期）
                        System.out.print("【数值类型】：");
                        // 是否是日期格式
                        if (DateUtil.isCellDateFormatted(cell)) {
                            Date dateValue = cell.getDateCellValue();
                            cellValue = new SimpleDateFormat("yyyy-MM-dd")
                                    .format(dateValue);
                        } else {
                            cellValue = cell.toString();
                        }
                        break;
                    case BOOLEAN: // 布尔类型
                        System.out.print("【布尔类型】：");
                        cellValue = String.valueOf(cell.getBooleanCellValue());
                        break;
                    case FORMULA: // 公式
                        System.out.print("【公式】：");
                        // 当前单元格的计算公式
                        String formula = cell.getCellFormula();
                        // 对单元格进行计算
                        CellValue value = eval.evaluate(cell);
                        // 将计算结果转为字符串
                        cellValue = value.formatAsString();
                        break;
                    case ERROR: // 错误单元格
                        System.out.print("【错误】：");
                        break;
                    case BLANK: // 空单元格
                        System.out.print("【空】：");
                        break;
                    case _NONE: // 未知类型
                        System.out.print("【未知】：");
                        break;
                }
                System.out.println(cellValue);
            }
        }
    }
}
// 关闭文件
excelFile.close();
```

##### 运行结果：

```
时间 | 数字 | 小数 | 布尔 | 字符串 | 求和 | 
【数值类型】：2021-06-10
【数值类型】：999.0
【数值类型】：9.9
【布尔类型】：true
【字符串】：哈哈哈
【公式】：1008.9
```

## easyExcel

### 依赖：

[最新依赖获取地址](https://search.maven.org/artifact/com.alibaba/easyexcel/2.2.7/jar)

easyExcel 中关联了 POI 依赖因此我们导入 easyExcel 依赖后就不需要再到 POI 依赖也能使用 POI。不过注意版本上的区别，新版POI有许多新功能如需使用，建议还是添加最新版的POI依赖。

```xml
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>easyexcel</artifactId>
  <version>2.2.7</version>
</dependency>
```

### 读写Excel：

在 [**EasyExcel 官网**](https://www.yuque.com/easyexcel/doc/quickstart) 有详细介绍这里不再做讲解。