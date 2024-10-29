import Link from 'next/link'
import { useRouter } from 'next/router'
import { Card } from 'shards-react';

import { Layout } from '../layout/layout';
import logo from '../../assets/logo.svg';

import { Profile } from './profile/profile';
import { Account } from './account/account';

export const UserLayout = () => {
    const pathname = useRouter().pathname.substring(1);

    const userPages = [{
        slug: 'profile',
        title: 'Profile',
        subtitle: 'Welcome to your Zerochass profile',
        component: Profile
    },
    {
        slug: 'account',
        title: 'Account',
        subtitle: 'Edit your account settings here',
        component: Account
    }];

    const SelectedPage = userPages.find((page) => page.slug.includes(pathname)) || userPages[0];

    return (
        <Layout
            pageTitle={SelectedPage.title}
        >
            <div className="user-layout">
                <div className="user-layout__container">

                    {/** Page Side Menu */}
                    <Card className="ul-side-menu">
                        <div className="user-layout__menu">
                            <div className="user-layout__logo">
                                <img src={logo} />
                            </div>
                            <ul className="user-layout__menu-links">
                                <li >
                                    <Link href="/profile">
                                        <a className={`user-layout__menu-link ${(pathname.includes('profile') ? 'active' : '')}`}>Profile</a>
                                    </Link>
                                </li>
                                <li >
                                    <Link href="/account">
                                        <a className={`user-layout__menu-link ${(pathname.includes('account') ? 'active' : '')}`}>Account</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Card>

                    {/** Page Content */}
                    <div className="user-layout__content">
                        <div className="user-layout__header" >
                            <p className="user-layout__title">{SelectedPage.title}</p>
                            <p className="user-layout__subtitle">{SelectedPage.subtitle}</p>
                        </div>
                        <div className="user-layout__body">
                            <SelectedPage.component />
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
};