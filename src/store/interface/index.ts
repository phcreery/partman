export type PBUserInfo = {
  id: string;
  created: string;
  updated: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string | null;
  username: string | null;
  avatar: string | null;
} | null;
// TODO: move this to API interface and reference that here.

/* themeConfigProp */
export interface ThemeConfigProp {
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  breadcrumb: boolean;
  tabs: boolean;
  footer: boolean;
}

/* GlobalState */
export interface GlobalState {
  token: string;
  userInfo: PBUserInfo;
  assemblySize: "default" | "large" | "small";
  language: string;
  themeConfig: ThemeConfigProp;
}

/* MenuState */
export interface MenuState {
  isCollapse: boolean;
  menuList: Menu.MenuOptions[];
}

/* TabsState */
export interface TabsState {
  tabsMenuValue: string;
  tabsMenuList: Menu.MenuOptions[];
}

/* AuthState */
export interface AuthState {
  authButtons: {
    [propName: string]: any;
  };
  authRouter: string[];
}
