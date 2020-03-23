# @umi-material/umi-search-table


## 功能说明

#### 1.将分页功能封装，使开发者不用处理分页逻辑；
#### 2.将搜索过滤和数据请求绑定，尽可能使开发者不用收集表单项数据。

## Usage

```sh
umi block add https://github.com/wurenjie1125/search-table-umi-block --closeFastGitHub=false --path=demoTable
```

### Table组件属性说明

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| initQuery | 加载后是否自动执行 | boolean | true |  |
| pageName | 页码的字段名| string | pageNum |  |
| pageSizeName | 一页数量的字段名 | string | pageSize |  |
| queryData | 请求数据的接口 | function | ({pagination, searchKey}) => {} |  |


## LICENSE

MIT

