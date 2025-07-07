import type { MenuOptions } from "@/api/modules/menu";

export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
  isCollapse: boolean;
  accordion: boolean;
  watermark: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: { name: string; email: string; avatar?: string; username: string };
}

// export interface UserGetters {}

// export interface UserActions {
//   setToken(token: string): void;
//   setUserInfo(userInfo: UserState["userInfo"]): void;
// }

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  isKeepAlive: boolean;
}

export interface TabsMenuActions {
  addTabs(tabItem: TabsMenuProps): Promise<void>;
  removeTabs(tabPath: string, isCurrent?: boolean): Promise<void>;
  closeTabsOnSide(path: string, type: "left" | "right"): Promise<void>;
  closeMultipleTab(tabsMenuValue?: string): Promise<void>;
  setTabs(tabsMenuList: TabsMenuProps[]): Promise<void>;
  setTabsTitle(title: string): Promise<void>;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: {
    [key: string]: string[];
  };
  authMenuList: MenuOptions[];
}

// export interface AuthGetters {
//   authButtonListGet: AuthState["authButtonList"];
//   authMenuListGet: AuthState["authMenuList"];
//   showMenuListGet: MenuOptions[];
//   flatMenuListGet: MenuOptions[];
//   breadcrumbListGet: MenuOptions[];
// }

// export interface AuthActions {
//   getAuthButtonList(): Promise<void>;
//   getAuthMenuList(): Promise<void>;
//   setRouteName(name: string): void;
// }

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}

// export interface KeepAliveGetters {}

// export interface KeepAliveActions {
//   addKeepAliveName(name: string): void;
//   removeKeepAliveName(name: string): void;
//   setKeepAliveName(keepAliveName?: string[]): void;
// }
