import React from 'react';
import style from './header.module.less';

interface Props {
    title: string;
    subtitle?: string;
}

export const Header = ({title, subtitle}: Props) => {

    return (
        <div className={style.header}>
            <h1 className={style.title}>{title}</h1>
            <p className={style.subtitle}>{subtitle}</p>
        </div>
    );
};