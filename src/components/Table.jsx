import React from 'react';
import { Table } from 'antd';
import { thousandToFormat } from './utils/util.js';
import createEnhancedSearchForm from './utils/createEnhancedSearchForm';
/**
 * props:
 * initQuery: Boolean 加载后是否自动查询
 * pageName:  String  页码的字段名:默认 pageNum
 * pageSizeName: String 一页数量的字段名: 默认 pageSize
 * queryData: Promise resolve({ success: true, total: Number, data:Array})
 * method:
 * search: 表格查询，可加额外参数。默认当前页参数
 */
class ClassicTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
      data: {
        list: [],
      },
      loading: true,
      params: {},
      searchKey: {},
    };
    this.searchFormRef = null;
  }

  componentDidMount() {
    const {
      searchKey = {},
      queryData,
      initQuery,
      pageName,
      pageSizeName,
      defaultPageSize,
    } = this.props;

    if (initQuery) {
      queryData
        && queryData({
          ...searchKey,
          pagination: {
            [pageName]: 1,
            [pageSizeName]: defaultPageSize,
          },
        }).then(res => {
          this.handleQueryData(res);
        });
    }
  }

  handleQueryData = res => {
    if (Array.isArray(res)) {
      res.forEach(item => {
        for (const i in item) {
          if (typeof item[i] === 'number' && !isNaN(item[i])) {
            item[i] = thousandToFormat(
              item[i],
              this.props.maximumFractionDigits,
            );
          }
        }
      });
      this.setState({
        loading: false,
        data: {
          list:
            res
            && res.map((item, index) => ({ ...item, key: index })),
        },
      });
    }
  };

  search = (searchParams) => {
    const {pageName, pageSizeName} = this.props;
    const { queryData } = this.props;
    this.setState({ loading: true });
    let params = null;
    if (searchParams) {
      params = {
        pagination: {
          [pageName]: searchParams[pageName] ? searchParams[pageName] : this.state.pagination.current,
          [pageSizeName]: searchParams[pageSizeName] ? searchParams[pageSizeName] : this.state.pagination.pageSize,
        },
        ...searchParams,
      };
    } else {
      params = {
        pagination: {
          [pageName]: this.state.pagination.current,
          [pageSizeName]: this.state.pagination.pageSize,
        },
      };
    }
    queryData
        && queryData(params).then(res => {
          this.handleQueryData(res);
        });
  };

  onChange = (pagination, filters, sorter, extra) => {
    this.setState({
      pagination: {
        current: pagination.current,
        pageSize: this.state.pagination.pageSize,
      },
    });
    this.props.queryData
      && this.props
        .queryData({
          pagination: {
            pageNum: pagination.current,
            pageSize: this.state.pagination.pageSize,
          },
          ...this.state.searchKey,
        })
        .then(res => {
          this.handleQueryData(res);
        });
  };

  // 校验表单
  onSearchSubmit = () => {
    const {pageName, pageSizeName} = this.props;
    this.searchFormRef && this.searchFormRef.validateFields((err, values) => {
      if (err) {
        console.warn('form valid error:', err);
        return false;
      }
      this.setState({
        searchKey: values,
      });
      this.props.queryData({
        pagination: {
          [pageName]: this.state.pagination.current,
          [pageSizeName]: this.state.pagination.pageSize,
        },
        searchKey: values,
      }).then(res => {
        this.handleQueryData(res);
      });
    });
  };

  render() {
    const { data, loading } = this.state;
    const EnhancedSearchForm = createEnhancedSearchForm(
      this.props.CustomSearchForm,
    );
    return (
      <React.Fragment>
        {
          EnhancedSearchForm && (
          <EnhancedSearchForm
            ref={ref => this.searchFormRef = ref}
            onSearchSubmit={this.onSearchSubmit}
          />
          )
        }

        <Table
          loading={loading}
          dataSource={data.list}
          onChange={this.onChange}
          pagination={this.state.pagination}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}
ClassicTable.defaultProps = {
  maximumFractionDigits: 2,
  pageName: 'pageNum',
  pageSizeName: 'pageSize',
  defaultPageSize: 10,
  initQuery: true,
};
export default ClassicTable;
