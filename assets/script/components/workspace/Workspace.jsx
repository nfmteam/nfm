import React, { Component } from 'react';
import classNames from 'classnames';
import Nav from './Nav.jsx';

export default class Workspace extends Component {

    constructor(props) {
        super(props);

        this.itemClick = this.itemClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        const prevWorkspacePath = prevProps.workspacePath;
        const { workspacePath, loadWorkspaceFilesHandler } = this.props;

        if (prevWorkspacePath !== workspacePath) {
            loadWorkspaceFilesHandler(workspacePath);
        }
    }

    componentWillMount() {
        const workspacePath = this.props.workspacePath;
        const loadWorkspaceFilesHandler = this.props.loadWorkspaceFilesHandler;
        const currentPath = this.props.workspace.currentPath;

        if (workspacePath !== currentPath) {
            loadWorkspaceFilesHandler(workspacePath);
        }
    }

    itemClick(item) {
        const push = this.props.push;

        if (item.type === 'd') {
            push(item.path);
        } else {
            alert('open file');
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
                    <Nav path={currentPath} clickHandler={loadWorkspaceFilesHandler}/>
                    <form action='#' method='get' className='sidebar-form'>
                        <div className='input-group'>
                            <input type='text' name='q' className='form-control' placeholder='Search...'/>
                            <span className='input-group-btn'>
                                <button type='submit' name='search' id='search-btn' className='btn btn-flat'>
                                    <i className='fa fa-search'/>
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
                                    <h3 className='box-title'>{currentPath.split('/').pop() || 'ROOT'}</h3>
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
                                        <tbody>
                                        <tr>
                                            <th width='5%'>
                                                <div className='icheckbox_flat-blue'>
                                                    <input type='checkbox'/>
                                                </div>
                                            </th>
                                            <th width='6%'/>
                                            <th width='35%'>名称</th>
                                            <th width='10%'>大小</th>
                                            <th width='10%'>作者</th>
                                            <th width='15%'>编辑日期</th>
                                            <th>创建日期</th>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className='table-block'>
                                        <table className='table self-table'>
                                            <tbody>
                                            {
                                                data.map(item => {
                                                    let iconClass = classNames({
                                                        'file-icon': true,
                                                        [`file-icon-${Workspace.getIconName(item.extname, item.type)}`]: true
                                                    });

                                                    return (
                                                        <tr key={item.path}>
                                                            <td width='5%'>
                                                                <div className='icheckbox_flat-blue'>
                                                                    <input type='checkbox'/>
                                                                </div>
                                                            </td>
                                                            <td width='6%'><i className={iconClass}/></td>
                                                            <td width='35%'>
                                                                <a href='javascript:;' onClick={() => this.itemClick(item)}>{item.name}</a>
                                                            </td>
                                                            <td width='10%'>{item.size}</td>
                                                            <td width='10%'> -</td>
                                                            <td width='15%'>{item.updateAt}</td>
                                                            <td>{item.createAt}</td>
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

Workspace.getIconName = function (extname, type) {
    if (type === 'd') {
        return 'folder';
    }

    switch (extname) {
        case '.js':
        case '.jsx':
            return 'js';
        case '.css':
            return 'css';
        case '.handlebars':
        case '.hbs':
            return 'handlebars';
        case '.html':
        case '.htm':
            return 'html';
        case '.gif':
        case '.jpg':
        case '.jpeg':
        case '.png':
            return 'image';
        case '.jade':
        case '.pug':
            return 'jade';
        case '.less':
            return 'less';
        case '.sass':
            return 'sass';
        case '.zip':
        case '.rar':
            return 'zip';
        default:
            return 'default';
    }
};