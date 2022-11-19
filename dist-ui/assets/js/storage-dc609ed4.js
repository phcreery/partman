import{d as E,r as f,a as v,b as y,c as n,e as O,f as i,w as o,h as t,v as d,B as S,j as p,C as P,D as T,g as j,l as g,I as F,J as D,_ as I}from"./index-39a2cc13.js";import{P as J,u as x}from"./index-c5d10715.js";import{u as z}from"./useAuthButtons-3eafde18.js";import{P as L}from"./index-b2ce0c30.js";import{S as Q,a as G}from"./StorageDrawer-2080d9a2.js";import{o as N,O as K,P as M,l as W,Q as X,q as Y,R as Z,S as ee,T as te}from"./components-5491d717.js";import"./util-bb5d7d1d.js";import"./index-9c5b8b05.js";const ae={class:"table-box"},re={class:"table-box"},oe=g(" New Storage "),se=g(" Delete "),ie=g("Edit"),ne=E({name:"useComponent"});var le=E({...ne,setup(ce){const m=f(),_=f(),u=v({expand:"category"}),V=v({}),B=e=>e,A=e=>({datalist:e.items,total:e.totalItems,pageNum:e.page,pageSize:e.perPage}),U=e=>{typeof u.filter=="undefined"&&Object.assign(u,{filter:{category:""}}),Object.assign(u.filter,{category:e.id})},{BUTTONS:l}=z(),$=[{type:"selection",width:40,fixed:"left"},{prop:"name",label:"Name",width:130,sortable:!0,search:!0,searchType:"text"},{prop:"category",label:"Category",width:120,sortable:!0,searchProps:{value:"id",label:"_fullName",props:{value:"id",label:"name",emitPath:!1},checkStrictly:!0},enumFunction:async()=>(await D(),await M()),enumTreeFunction:async()=>(await D(),await N())},{prop:"description",label:"Description",search:!0,searchType:"text"},{prop:"action",label:"Action",width:100,fixed:"right"}],q=async e=>{await x(ee,{ids:e},"Delete the selected footprints(s)"),m.value.refresh()},R=async e=>{await x(te,{ids:e},"Delete the selected footprint categories(s)"),_.value.refresh()},w=f(),b=(e,s={})=>{let r={title:e,rowData:{...s},isView:e==="View",apiUrl:e==="New"?W:e==="Edit"?X:"",updateTable:m.value.refresh};w.value.acceptParams(r)},C=f(),k=(e,s={})=>{let r={title:e,rowData:{...s},isView:e==="View",apiUrl:e==="New"?Y:e==="Edit"?Z:"",updateTable:_.value.refresh};C.value.acceptParams(r)};return(e,s)=>{const r=y("el-button"),h=y("el-col"),H=y("el-row");return n(),O("div",ae,[i(H,{gutter:20},{default:o(()=>[i(h,{span:6},{default:o(()=>[i(L,{ref_key:"proTree",ref:_,requestApi:t(N),initParam:V,dataCallback:B,onHandleNodeClick:U},{treeHeader:o(a=>[t(l).add?(n(),d(r,{key:0,type:"primary",icon:t(S),onClick:s[0]||(s[0]=c=>k("New"))},null,8,["icon"])):p("v-if",!0),t(l).edit?(n(),d(r,{key:1,icon:t(P),disabled:a.row.id==="",onClick:c=>k("Edit",a.row)},null,8,["icon","disabled","onClick"])):p("v-if",!0),t(l).delete?(n(),d(r,{key:2,type:"danger",icon:t(T),plain:"",disabled:a.row.id==="",onClick:c=>R([a.row.id])},null,8,["icon","disabled","onClick"])):p("v-if",!0)]),_:1},8,["requestApi","initParam"])]),_:1}),i(h,{span:18},{default:o(()=>[j("div",re,[i(J,{ref_key:"proTable",ref:m,columns:$,requestApi:t(K),initParam:u,isPageable:!0,dataCallback:A},{tableHeader:o(a=>[t(l).add?(n(),d(r,{key:0,type:"primary",icon:t(S),onClick:s[1]||(s[1]=c=>b("New"))},{default:o(()=>[oe]),_:1},8,["icon"])):p("v-if",!0),t(l).delete?(n(),d(r,{key:1,type:"danger",icon:t(T),plain:"",disabled:!a.isSelected,onClick:c=>q(a.ids)},{default:o(()=>[se]),_:2},1032,["icon","disabled","onClick"])):p("v-if",!0)]),expand:o(a=>[g(F(a.row),1)]),action:o(a=>[i(r,{type:"primary",link:"",icon:t(P),onClick:c=>b("Edit",a.row)},{default:o(()=>[ie]),_:2},1032,["icon","onClick"])]),_:1},8,["requestApi","initParam"]),i(Q,{ref_key:"drawerRefStorage",ref:w},null,512),i(G,{ref_key:"drawerRefStorageCategory",ref:C},null,512)])]),_:1})]),_:1})])}}}),we=I(le,[["__file","C:/Users/phcre/Documents/JS/partman/client/src/views/storage/storage.vue"]]);export{we as default};