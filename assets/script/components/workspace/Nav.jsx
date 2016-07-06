import React, { Component } from 'react';

export default class Nav extends Component {

    formatPath(path) {
        let navPath, navName, index = 0, objs = [{
            navPath: '/',
            navName: 'ROOT'
        }];

        if (path === '/') {
            return objs;
        }

        let paths = path.substr(1).split('/');
        for (let i = 0, j = paths.length; i < j; i++) {
            navName = paths[i];
            index = path.indexOf(navName, index) + navName.length;
            navPath = path.slice(0, index);

            objs.push({
                navPath,
                navName
            });
        }

        return objs;
    }

    render() {
        const { path, clickHandler } = this.props;
        const paths = this.formatPath(path);
        const lastIndex = paths.length - 1;

        return (
            <ol className='breadcrumb'>
                {
                    paths.map((obj, index) => {
                        return lastIndex !== index ?
                            <li key={obj.navPath}>
                                <a href='javascript:;' onClick={() => clickHandler(obj.navPath)}>
                                    {index === 0 ? <i className='fa fa-dashboard'/> : null}
                                    {obj.navName}
                                </a>
                            </li> :
                            <li className='active' key={obj.navPath}>{obj.navName}</li>
                    })
                }
            </ol>
        );
    }
}