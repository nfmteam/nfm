import React, { Component } from 'react';
import Nav from './Nav.jsx';

export default class Workspace extends Component {

    componentWillMount() {
        const workspacePath = this.props.workspacePath;
        const loadWorkspaceFilesHandler = this.props.loadWorkspaceFilesHandler;
        const currentPath = this.props.workspace.currentPath;

        if (workspacePath !== currentPath) {
            loadWorkspaceFilesHandler(workspacePath);
        }
    }

    render() {
        const {
            workspace: {
                data: data,
                currentPath: currentPath
            },
            loadWorkspaceFilesHandler
        } = this.props;

        return (
            <div className='content-wrapper'>
                <section className='content-header clearfix'>
                    <Nav path={currentPath} clickHandler={loadWorkspaceFilesHandler} />
                    <form action='#' method='get' className='sidebar-form'>
                        <div className='input-group'>
                            <input type='text' name='q' className='form-control' placeholder='Search...' />
                            <span className='input-group-btn'>
                                <button type='submit' name='search' id='search-btn' className='btn btn-flat'>
                                    <i className='fa fa-search' />
                                </button>
                            </span>
                        </div>
                    </form>
                </section>

                <section className='content'>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <div className='box'>
                                <div className='box-header self-box-header'>
                                    <h3 className='box-title'>Table</h3>
                                    <div className='self-btn-group'>
                                        <div className='btn-group'>
                                            <button type='button' className='btn btn-default btn-sm'><i className='fa fa-magic'/> 新建</button>
                                            <button type='button' className='btn btn-default btn-sm'><i className='fa fa-upload'/> 上传</button>
                                            <button type='button' className='btn btn-default btn-sm'><i className='fa fa-download'/> 下载</button>
                                            <button type='button' className='btn btn-default btn-sm'><i className='fa fa-refresh'/> 发布</button>
                                            <button type='button' className='btn btn-default btn-sm'><i className='fa fa-trash-o'/> 删除</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='box-body table-responsive no-padding self-body-body'>
                                    <table className='table self-table'>
                                        <tbody><tr>
                                            <th width='5%'>
                                                <div className='icheckbox_flat-blue'>
                                                    <input type='checkbox' />
                                                </div>
                                            </th>
                                            <th width='6%' />
                                            <th width='30%'>名称</th>
                                            <th width='10%'>类型</th>
                                            <th width='6%'>大小</th>
                                            <th width='10%'>作者</th>
                                            <th width='15%'>最后编辑日期</th>
                                            <th>发布日期</th>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className='table-block'>
                                        <table className='table self-table'>
                                            <tbody>
                                                {
                                                    data.map(item => {
                                                        return (
                                                            <tr key={item.path}>
                                                                <td width='5%'>
                                                                    <div className='icheckbox_flat-blue'>
                                                                        <input type='checkbox' />
                                                                    </div>
                                                                </td>
                                                                <td width='6%'><i className='file-icon file-icon-js' /></td>
                                                                <td width='30%'><a href='javascript:;'>{item.name}</a></td>
                                                                <td width='10%'>folder</td>
                                                                <td width='6%'/>
                                                                <td width='10%'>-</td>
                                                                <td width='15%'>16-6-3 下午3:02</td>
                                                                <td>-</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        );
    }
}