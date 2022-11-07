import{P as K,u as M}from"./index-f6cecc40.js";import{I as W,J as Y,u as Z}from"./index-f87d0c58.js";import{A as ee,p as te,c as ae,u as oe,B as le,C as re,D as ne,E as se,F as ie,G as ce,H as de,I as ue,J as pe}from"./components-3024ebe5.js";import{P as me}from"./index-f4cd435f.js";import{d as U,a as A,r as p,S as O,b as d,a3 as _e,c as _,e as R,f as a,w as o,U as B,V as Q,t as C,g as S,F as fe,M as ve,u as c,X as we,C as F,a4 as be,j as b,E as G,D as z,A as L,B as j,_ as J,a7 as ye,a8 as Ce}from"./index-0dd33b3d.js";import{C as De}from"./ComponentDrawer-b9133636.js";import"./util-29963aac.js";import"./plugin-vue_export-helper-b2bddca3.js";import"./index-f8e1d059.js";import"./FootprintDrawer-57ebfb14.js";import"./StorageDrawer-c1b5f019.js";const Pe={class:"form-item-with-buttons"},he={style:{float:"left"}},ge={style:{float:"right",color:"var(--el-text-color-secondary)","font-size":"13px"}},ke=b("Cancel"),je=b("Save"),Ve=U({name:"UserDrawer"}),xe=U({...Ve,setup(H,{expose:w}){const h=A({name:[{required:!0,message:"Please enter the project name",trigger:"change"}],description:[{required:!1,message:"Please enter project description",trigger:"change"}]}),i=p(!1),e=p({isView:!1,title:""}),T=s=>{e.value=s,i.value=!0},g=p(),E=()=>{g.value.validate(async s=>{if(!!s)try{await e.value.apiUrl(e.value.rowData),G.success({message:`${e.value.title} project success!`}),e.value.updateTable(),i.value=!1}catch(r){}})},y=(s,r)=>s.length>r?s.substring(0,r)+"...":this,n=p(),D=()=>ee().then(s=>n.value=s.data);O(i,s=>{s&&D()});const k=p(),V=(s,r={})=>{let f={title:s,rowData:{...r},isView:s==="View",apiUrl:s==="New"?te:s==="Edit"?ae:"",updateTable:D};k.value.acceptParams(f)};return w({acceptParams:T}),(s,r)=>{const f=d("el-option"),N=d("el-select"),P=d("el-button"),q=d("el-button-group"),I=d("el-space"),t=d("el-form-item"),m=d("el-input-number"),u=d("el-form"),x=d("el-drawer"),$=_e("loading");return _(),R("div",null,[a(x,{modelValue:i.value,"onUpdate:modelValue":r[5]||(r[5]=l=>i.value=l),"destroy-on-close":!0,size:"600px",title:`${e.value.title} Project Component`},{footer:o(()=>[a(P,{onClick:r[4]||(r[4]=l=>i.value=!1)},{default:o(()=>[ke]),_:1}),B(a(P,{type:"primary",onClick:E},{default:o(()=>[je]),_:1},512),[[Q,!e.value.isView]])]),default:o(()=>[a(u,{ref_key:"ruleFormRef",ref:g,rules:h,disabled:e.value.isView,model:e.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:o(()=>[B((_(),C(t,{label:"MPN",prop:"id"},{default:o(()=>[S("div",Pe,[a(I,null,{default:o(()=>[a(N,{modelValue:e.value.rowData.id,"onUpdate:modelValue":r[0]||(r[0]=l=>e.value.rowData.id=l),placeholder:"",clearable:"",filterable:"",style:{width:"max-content"}},{default:o(()=>[(_(!0),R(fe,null,ve(n.value,l=>(_(),C(f,{key:l.id,label:l.mpn,value:l.id},{default:o(()=>[S("span",he,z(l.mpn),1),S("span",ge,z(y(l.description,25)),1)]),_:2},1032,["label","value"]))),128))]),_:1},8,["modelValue"]),a(q,null,{default:o(()=>[a(P,{icon:c(we),onClick:D},null,8,["icon"]),a(P,{icon:c(F),disabled:!e.value.rowData.id||e.value.rowData.id==="",onClick:r[1]||(r[1]=l=>{var v;return V("Edit",(v=n.value)==null?void 0:v.find(X=>X.id===e.value.rowData.id))})},null,8,["icon","disabled"]),a(P,{icon:c(be),onClick:r[2]||(r[2]=l=>V("New"))},null,8,["icon"])]),_:1})]),_:1})])]),_:1})),[[$,n.value===void 0]]),a(t,{label:"Quantity",prop:"_quantityUsed"},{default:o(()=>[a(m,{modelValue:e.value.rowData._quantityUsed,"onUpdate:modelValue":r[3]||(r[3]=l=>e.value.rowData._quantityUsed=l)},null,8,["modelValue"])]),_:1})]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"]),a(De,{ref_key:"drawerRefCreateComponent",ref:k},null,512)])}}});var $e=xe;const Ue=b("Cancel"),Te=b("Save"),Ee=U({name:"UserDrawer"}),Ne=U({...Ee,setup(H,{expose:w}){const h=A({name:[{required:!0,message:"Please enter the project name",trigger:"change"}],description:[{required:!1,message:"Please enter project description",trigger:"change"}]}),i=p(!1),e=p({isView:!1,title:""}),T=y=>{e.value=y,i.value=!0},g=p(),E=()=>{g.value.validate(async y=>{if(!!y)try{await e.value.apiUrl(e.value.rowData),G.success({message:`${e.value.title} project success!`}),e.value.updateTable(),i.value=!1}catch(n){}})};return O(i,y=>{}),w({acceptParams:T}),(y,n)=>{const D=d("el-input"),k=d("el-form-item"),V=d("el-form"),s=d("el-button"),r=d("el-drawer");return _(),R("div",null,[a(r,{modelValue:i.value,"onUpdate:modelValue":n[3]||(n[3]=f=>i.value=f),"destroy-on-close":!0,size:"600px",title:`${e.value.title} Project`},{footer:o(()=>[a(s,{onClick:n[2]||(n[2]=f=>i.value=!1)},{default:o(()=>[Ue]),_:1}),B(a(s,{type:"primary",onClick:E},{default:o(()=>[Te]),_:1},512),[[Q,!e.value.isView]])]),default:o(()=>[a(V,{ref_key:"ruleFormRef",ref:g,rules:h,disabled:e.value.isView,model:e.value.rowData,"label-width":"130px","label-suffix":" :","append-to-body":!0},{default:o(()=>[a(k,{label:"Name",prop:"name"},{default:o(()=>[a(D,{modelValue:e.value.rowData.name,"onUpdate:modelValue":n[0]||(n[0]=f=>e.value.rowData.name=f),placeholder:"Please fill in the project",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1}),a(k,{label:"Description",prop:"description"},{default:o(()=>[a(D,{modelValue:e.value.rowData.description,"onUpdate:modelValue":n[1]||(n[1]=f=>e.value.rowData.description=f),placeholder:"Please fill in the project description",clearable:"",rows:4,type:"textarea",autosize:""},null,8,["modelValue"])]),_:1})]),_:1},8,["rules","disabled","model"])]),_:1},8,["modelValue","title"])])}}});var qe=Ne;const Ie={class:"table-box"},Se={class:"table-box"},Ae=b(" Add Component "),Re=b(" Delete "),Be=b("Import BOM"),Fe=b("Export"),ze=b("Edit"),He=U({name:"useComponent"});var et=U({...He,setup(H){const w=p(),h=p(),i=A({expand:"components",projectID:""}),e=A({}),T=p(),g=t=>(T.value=t,t),E=t=>({datalist:t.items,total:t.totalItems,pageNum:t.page,pageSize:t.perPage}),y=t=>{i.projectID=t.id},{BUTTONS:n}=oe(),D=[{type:"selection",width:40,fixed:"left"},{prop:"_quantityUsed",label:"Qty.",width:80,sortable:!0},{prop:"mpn",label:"MPN",width:130,sortable:!0,search:!0,searchType:"text"},{prop:"description",label:"Description",search:!0,searchType:"text"},{prop:"action",label:"Action",width:100,fixed:"right"}],k=async t=>{await M(ne,{projectID:String(i.projectID),ids:t},"Remove the selected components(s) from project"),w.value.refresh()},V=async t=>{await M(pe,{ids:t},"Delete the selected projects(s)"),h.value.refresh()},s=async()=>{var $;let t=i.projectID,m=await se({filter:w.value.searchParam,projectID:($=i.projectID)!=null?$:""}),u=w.value.tableColumns.map(l=>{var v;return(v=l.prop)!=null?v:""}),x=Y(m,u);Z(()=>x,`${t}_project_component_list`,{},!0,".csv")},r=p(),f=()=>{let t={title:"component",getTableList:w.value.refresh};r.value.acceptParams(t)},N=p(),P=(t,m={})=>{let u={title:t,rowData:{_ofProjectID:i.projectID,id:m.id,_quantityUsed:m._quantityUsed},isView:t==="View",apiUrl:t==="New"?ie:t==="Edit"?ce:"",updateTable:w.value.refresh};N.value.acceptParams(u)},q=p(),I=(t,m={})=>{let u={title:t,rowData:{...m},isView:t==="View",apiUrl:t==="New"?de:t==="Edit"?ue:"",updateTable:h.value.refresh};q.value.acceptParams(u)};return(t,m)=>{const u=d("el-button"),x=d("el-col"),$=d("el-row");return _(),R("div",Ie,[a($,{gutter:20},{default:o(()=>[a(x,{span:6},{default:o(()=>[a(me,{ref_key:"proTree",ref:h,requestApi:c(le),initParam:e,dataCallback:g,onHandleNodeClick:y,showAll:!1},{treeHeader:o(l=>[c(n).add?(_(),C(u,{key:0,type:"primary",icon:c(L),onClick:m[0]||(m[0]=v=>I("New"))},null,8,["icon"])):j("",!0),c(n).edit?(_(),C(u,{key:1,icon:c(F),disabled:l.row.id==="",onClick:v=>I("Edit",l.row)},null,8,["icon","disabled","onClick"])):j("",!0),c(n).delete?(_(),C(u,{key:2,type:"danger",icon:c(J),plain:"",disabled:l.row.id==="",onClick:v=>V([l.row.id])},null,8,["icon","disabled","onClick"])):j("",!0)]),_:1},8,["requestApi","initParam"])]),_:1}),a(x,{span:18},{default:o(()=>[S("div",Se,[a(K,{ref_key:"proTable",ref:w,columns:D,requestApi:c(re),initParam:i,isPageable:!0,dataCallback:E},{tableHeader:o(l=>[c(n).add?(_(),C(u,{key:0,type:"primary",icon:c(L),onClick:m[1]||(m[1]=v=>P("New"))},{default:o(()=>[Ae]),_:1},8,["icon"])):j("",!0),c(n).delete?(_(),C(u,{key:1,type:"danger",icon:c(J),plain:"",disabled:!l.isSelected,onClick:v=>k(l.ids)},{default:o(()=>[Re]),_:2},1032,["icon","disabled","onClick"])):j("",!0),c(n).batchAdd?(_(),C(u,{key:2,type:"primary",icon:c(ye),plain:"",onClick:f},{default:o(()=>[Be]),_:1},8,["icon"])):j("",!0),c(n).export?(_(),C(u,{key:3,type:"primary",icon:c(Ce),plain:"",onClick:s},{default:o(()=>[Fe]),_:1},8,["icon"])):j("",!0)]),expand:o(l=>[b(z(l.row),1)]),action:o(l=>[a(u,{type:"primary",link:"",icon:c(F),onClick:v=>P("Edit",l.row)},{default:o(()=>[ze]),_:2},1032,["icon","onClick"])]),_:1},8,["requestApi","initParam"])])]),_:1})]),_:1}),a(qe,{ref_key:"drawerRefProject",ref:q},null,512),a($e,{ref_key:"drawerRefComponent",ref:N},null,512),a(W,{ref_key:"dialogRef",ref:r},null,512)])}}});export{et as default};