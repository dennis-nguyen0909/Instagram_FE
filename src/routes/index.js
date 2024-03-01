import { NotFound } from "../component/NotFound/NotFound";
import { AdminPage } from "../pages/AdminPage/AdminPage";
import ChatPage from "../pages/ChatPage/ChatPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { ProfileUserOther } from "../pages/ProfileUserOther/ProfilePage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";


export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/profile/:id',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/profile-user/:id',
        page: ProfileUserOther,
        isShowHeader: true,
    },
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: '/direct/inbox/:id',
        page: ChatPage,
        isShowHeader: false,
    },
    {
        path: '/direct/inbox',
        page: ChatPage,
        isShowHeader: false,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFound,
        isShowHeader: false
    },
]

