import React, { Component } from 'react';

export default class Nav extends Component {

    formatPath(path) {
        let navPath, navName, index = 0, objs = [{
            navPath: '/',
            navName: '/'
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
            <p>
                {
                    paths.map((obj, index) => {
                        return lastIndex !== index ?
                            <span key={obj.navPath}>
                                <a href='javascript:;' onClick={() => clickHandler(obj.navPath)}>
                                    {obj.navName}
                                </a>
                                <i> > </i>
                            </span>
                            :
                            <span key={obj.navPath}>{obj.navName}</span>
                    })
                }
            </p>
        );
    }
}